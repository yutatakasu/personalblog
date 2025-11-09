"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Area } from "react-easy-crop";
import Cropper from "react-easy-crop";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getCroppedImageBlob } from "@/lib/image-crop";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";

const teamMemberSchema = z.object({
  id: z.string().min(1, "IDは必須です"),
  name: z.string().min(1, "名前は必須です"),
  title: z.string().min(1, "役職は必須です"),
  focus: z.string().min(1, "フォーカスは必須です"),
  imageSrc: z.string().min(1, "画像のアップロードは必須です"),
  positionRow: z.number().int().min(1, "行は1以上である必要があります"),
  positionColumn: z.number().int().min(1, "列は1以上である必要があります"),
  positionOffsetY: z.string().optional(),
});

type TeamMemberFormData = z.infer<typeof teamMemberSchema>;

type TeamFormProps = {
  initialData?: {
    id: string;
    name: string;
    title: string;
    focus: string;
    image_src: string;
    image_alt?: string;
    position_row: number;
    position_column: number;
    position_offset_y?: string;
  };
};

export function TeamForm({ initialData }: TeamFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_src || null,
  );
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropAreaPixels, setCropAreaPixels] = useState<Area | null>(null);
  const [imageForCrop, setImageForCrop] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: initialData
      ? {
          id: initialData.id,
          name: initialData.name,
          title: initialData.title,
          focus: initialData.focus,
          imageSrc: initialData.image_src,
          positionRow: initialData.position_row,
          positionColumn: initialData.position_column,
          positionOffsetY: initialData.position_offset_y || "",
        }
      : {
          positionRow: 1,
          positionColumn: 1,
          positionOffsetY: "",
        },
  });

  const onSubmit = async (data: TeamMemberFormData) => {
    setLoading(true);
    setError(null);

    try {
      const adminSupabase = getAdminSupabaseClient();
      let finalImageSrc = data.imageSrc;
      const bucketName =
        process.env.NEXT_PUBLIC_SUPABASE_TEAM_BUCKET?.trim() || "team-photos";
      const rawFolderName =
        process.env.NEXT_PUBLIC_SUPABASE_TEAM_FOLDER?.trim() ?? "";
      const folderName = rawFolderName.length > 0 ? rawFolderName : undefined;

      if (croppedFile) {
        setUploadingImage(true);
        const fileExt =
          croppedFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const baseName = data.id || croppedFile.name.replace(/\.[^.]+$/, "");
        const prefix =
          folderName && folderName !== bucketName ? `${folderName}/` : "";
        const storagePath = `${prefix}${baseName}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await adminSupabase.storage
          .from(bucketName)
          .upload(storagePath, croppedFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          setError(
            uploadError.message?.includes("Bucket not found")
              ? `画像保存用バケット "${bucketName}" が存在しません。Supabase Storage で作成するか、NEXT_PUBLIC_SUPABASE_TEAM_BUCKET を既存バケット名に設定してください。`
              : (uploadError.message ?? "画像のアップロードに失敗しました"),
          );
          setUploadingImage(false);
          setLoading(false);
          return;
        }

        const { data: publicUrlData } = adminSupabase.storage
          .from(bucketName)
          .getPublicUrl(storagePath);

        finalImageSrc = publicUrlData?.publicUrl ?? "";

        if (!finalImageSrc) {
          setError("公開URLの取得に失敗しました");
          setUploadingImage(false);
          setLoading(false);
          return;
        }

        setValue("imageSrc", finalImageSrc, { shouldValidate: true });
        setUploadingImage(false);
      }

      if (!finalImageSrc) {
        setError("画像が設定されていません");
        setLoading(false);
        return;
      }

      const teamMemberData = {
        id: data.id,
        name: data.name,
        title: data.title,
        focus: data.focus,
        image_src: finalImageSrc,
        position_row: data.positionRow,
        position_column: data.positionColumn,
        position_offset_y: data.positionOffsetY || null,
      };

      if (initialData) {
        // 更新
        const { error: updateError } = await adminSupabase
          .from("team_members")
          .update(teamMemberData)
          .eq("id", data.id);

        if (updateError) {
          setError(updateError.message);
          setLoading(false);
          return;
        }
      } else {
        // 新規作成
        const { error: insertError } = await adminSupabase
          .from("team_members")
          .insert(teamMemberData);

        if (insertError) {
          setError(insertError.message);
          setLoading(false);
          return;
        }
      }

      router.push("/admin/team");
      router.refresh();
    } catch (_err) {
      setError("保存に失敗しました");
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("画像ファイルを選択してください");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFileName(file.name);
      setImageForCrop(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (_: Area, areaPixels: Area) => {
    setCropAreaPixels(areaPixels);
  };

  const handleCropCancel = () => {
    setCropModalOpen(false);
    setImageForCrop(null);
    setCropAreaPixels(null);
    setSelectedFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropConfirm = async () => {
    if (!imageForCrop || !cropAreaPixels) {
      setError("画像の切り抜き範囲を決定できませんでした");
      return;
    }

    try {
      const blob = await getCroppedImageBlob(imageForCrop, cropAreaPixels);
      const extension =
        selectedFileName.split(".").pop()?.toLowerCase() ?? "jpg";
      const fileName = `team-member-${Date.now()}.${extension}`;
      const file = new File([blob], fileName, {
        type: blob.type || "image/jpeg",
      });

      setCroppedFile(file);

      const previewUrl = URL.createObjectURL(file);
      setObjectUrl((previous) => {
        if (previous) {
          URL.revokeObjectURL(previous);
        }
        return previewUrl;
      });
      setImagePreview(previewUrl);
      setValue("imageSrc", previewUrl, { shouldValidate: true });

      setCropModalOpen(false);
      setImageForCrop(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (cropError) {
      console.error(cropError);
      setError("画像の切り抜きに失敗しました");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="id"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            ID <span className="text-red-500">*</span>
          </label>
          <input
            id="id"
            {...register("id")}
            disabled={!!initialData}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 disabled:bg-neutral-100"
            placeholder="yuki-miyazaki"
          />
          {errors.id && (
            <p className="mt-1 text-sm text-red-600">{errors.id.message}</p>
          )}
          <p className="mt-1 text-xs text-neutral-500">
            URLに使用されるID（英数字とハイフンのみ、編集時は変更不可）
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-neutral-700"
            >
              名前 <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              {...register("name")}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
              placeholder="Yuki Miyazaki"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-neutral-700"
            >
              役職 <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              {...register("title")}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
              placeholder="Founder & CEO"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="focus"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            フォーカス <span className="text-red-500">*</span>
          </label>
          <textarea
            id="focus"
            {...register("focus")}
            rows={3}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            placeholder="長期的な記憶レイヤー戦略を定義し、Atlas 全体のビジョンとガバナンスをリードします。"
          />
          {errors.focus && (
            <p className="mt-1 text-sm text-red-600">{errors.focus.message}</p>
          )}
        </div>

        <input type="hidden" {...register("imageSrc")} />

        <div>
          <p className="mb-2 text-sm font-medium text-neutral-700">
            顔写真 <span className="text-red-500">*</span>
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative h-32 w-32 overflow-hidden rounded-full border border-dashed border-neutral-300 bg-neutral-50">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="プレビュー"
                  fill
                  sizes="128px"
                  className="object-cover"
                  onError={() => setImagePreview(null)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                  画像なし
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <button
                type="button"
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                {imagePreview ? "画像を変更" : "画像をアップロード"}
              </button>
              <p className="text-xs text-neutral-500">
                正方形の画像を推奨します。アップロード後にトリミング範囲を調整できます。
              </p>
              {errors.imageSrc && (
                <p className="text-xs text-red-600">
                  {errors.imageSrc.message}
                </p>
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="positionRow"
              className="mb-2 block text-sm font-medium text-neutral-700"
            >
              行 <span className="text-red-500">*</span>
            </label>
            <input
              id="positionRow"
              type="number"
              {...register("positionRow", { valueAsNumber: true })}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
              placeholder="1"
            />
            {errors.positionRow && (
              <p className="mt-1 text-sm text-red-600">
                {errors.positionRow.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="positionColumn"
              className="mb-2 block text-sm font-medium text-neutral-700"
            >
              列 <span className="text-red-500">*</span>
            </label>
            <input
              id="positionColumn"
              type="number"
              {...register("positionColumn", { valueAsNumber: true })}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
              placeholder="1"
            />
            {errors.positionColumn && (
              <p className="mt-1 text-sm text-red-600">
                {errors.positionColumn.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="positionOffsetY"
              className="mb-2 block text-sm font-medium text-neutral-700"
            >
              オフセットY
            </label>
            <input
              id="positionOffsetY"
              {...register("positionOffsetY")}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
              placeholder="-24px"
            />
            {errors.positionOffsetY && (
              <p className="mt-1 text-sm text-red-600">
                {errors.positionOffsetY.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="rounded-lg bg-neutral-900 px-6 py-2 font-medium text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading || uploadingImage
              ? "保存中..."
              : initialData
                ? "更新"
                : "作成"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-neutral-300 px-6 py-2 font-medium text-neutral-700 transition hover:bg-neutral-100"
          >
            キャンセル
          </button>
        </div>
      </form>

      {cropModalOpen && imageForCrop ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-900">
              <Cropper
                image={imageForCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <label
                className="text-sm font-medium text-neutral-600"
                htmlFor="crop-zoom"
              >
                ズーム
              </label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                id="crop-zoom"
                onChange={(event) => setZoom(Number(event.target.value))}
                className="flex-1"
              />
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
                  onClick={handleCropCancel}
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
                  onClick={handleCropConfirm}
                >
                  この範囲を使用
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
