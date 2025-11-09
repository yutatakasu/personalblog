"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Area } from "react-easy-crop";
import Cropper from "react-easy-crop";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { getCroppedImageBlob } from "@/lib/image-crop";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";
import {
  type NormalizedSupporter,
  normalizeSupporters,
} from "@/lib/supporters/normalize";

const supporterSchema = z.object({
  name: z.string().min(1, "サポーター名は必須です"),
  title: z.string().optional(),
  focus: z.string().optional(),
  imageSrc: z.string().min(1, "画像のアップロードは必須です"),
});

const supporterGroupSchema = z.object({
  category: z.string().min(1, "カテゴリーは必須です"),
  supporters: z.array(supporterSchema).min(1, "サポーターを追加してください"),
});

type SupporterGroupFormData = z.infer<typeof supporterGroupSchema>;

type SupporterFormProps = {
  initialData?: {
    id: number;
    category: string;
    supporters: unknown;
  };
};

export function SupporterForm({ initialData }: SupporterFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cropModalIndex, setCropModalIndex] = useState<number | null>(null);
  const [imageForCrop, setImageForCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropAreaPixels, setCropAreaPixels] = useState<Area | null>(null);

  const normalizedSupporters: NormalizedSupporter[] = initialData
    ? normalizeSupporters(initialData.supporters)
    : [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<SupporterGroupFormData>({
    resolver: zodResolver(supporterGroupSchema),
    defaultValues: initialData
      ? {
          category: initialData.category,
          supporters:
            normalizedSupporters.length > 0
              ? normalizedSupporters.map((supporter) => ({
                  name: supporter.name,
                  title: supporter.title ?? "",
                  focus: supporter.focus ?? "",
                  imageSrc: supporter.image_src ?? "",
                }))
              : [
                  {
                    name: "",
                    title: "",
                    focus: "",
                    imageSrc: "",
                  },
                ],
        }
      : {
          supporters: [
            {
              name: "",
              title: "",
              focus: "",
              imageSrc: "",
            },
          ],
        },
  });

  const {
    fields: supporterFields,
    append: appendSupporter,
    remove: removeSupporter,
  } = useFieldArray({
    control,
    name: "supporters",
  });

  const [previews, setPreviews] = useState<string[]>(() =>
    normalizedSupporters.map((supporter) => supporter.image_src ?? ""),
  );

  const croppedFilesRef = useRef<(File | null)[]>(
    normalizedSupporters.map(() => null),
  );

  useEffect(() => {
    const supporterCount = supporterFields.length;
    if (previews.length !== supporterCount) {
      setPreviews((prev) => {
        const next = [...prev];
        while (next.length < supporterCount) {
          next.push("");
        }
        return next.slice(0, supporterCount);
      });
    }

    if (croppedFilesRef.current.length !== supporterCount) {
      while (croppedFilesRef.current.length < supporterCount) {
        croppedFilesRef.current.push(null);
      }
      croppedFilesRef.current = croppedFilesRef.current.slice(
        0,
        supporterCount,
      );
    }
  }, [supporterFields.length, previews.length]);

  const ensureStateLength = (length: number) => {
    setPreviews((prev) => {
      const next = [...prev];
      while (next.length < length) {
        next.push("");
      }
      return next.slice(0, length);
    });

    if (croppedFilesRef.current.length !== length) {
      while (croppedFilesRef.current.length < length) {
        croppedFilesRef.current.push(null);
      }
      croppedFilesRef.current = croppedFilesRef.current.slice(0, length);
    }
  };

  const appendSupporterWithState = () => {
    appendSupporter({ name: "", title: "", focus: "", imageSrc: "" });
    ensureStateLength(supporterFields.length + 1);
  };

  const removeSupporterWithState = (index: number) => {
    removeSupporter(index);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    croppedFilesRef.current = croppedFilesRef.current.filter(
      (_, i) => i !== index,
    );
  };

  const handleFileSelect =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
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
        setImageForCrop(reader.result as string);
        setCropModalIndex(index);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      };
      reader.readAsDataURL(file);
      // store original file temporarily in ref for cropping confirmation
      croppedFilesRef.current[index] = file;
    };

  const handleCropComplete = (_: Area, areaPixels: Area) => {
    setCropAreaPixels(areaPixels);
  };

  const handleCropCancel = () => {
    setCropModalIndex(null);
    setImageForCrop(null);
    setCropAreaPixels(null);
  };

  const handleCropConfirm = async () => {
    if (cropModalIndex === null || !imageForCrop || !cropAreaPixels) {
      setError("画像の切り抜き範囲を決定できませんでした");
      return;
    }

    try {
      const blob = await getCroppedImageBlob(imageForCrop, cropAreaPixels);
      const extension =
        croppedFilesRef.current[cropModalIndex]?.name
          ?.split(".")
          .pop()
          ?.toLowerCase() ?? "jpg";
      const fileName = `supporter-${Date.now()}.${extension}`;
      const file = new File([blob], fileName, {
        type: blob.type || "image/jpeg",
      });

      croppedFilesRef.current[cropModalIndex] = file;

      const previewUrl = URL.createObjectURL(file);
      setPreviews((prev) => {
        const next = [...prev];
        next[cropModalIndex] = previewUrl;
        return next;
      });
      setValue(`supporters.${cropModalIndex}.imageSrc`, previewUrl, {
        shouldValidate: true,
      });
    } catch (cropError) {
      console.error(cropError);
      setError("画像の切り抜きに失敗しました");
    } finally {
      handleCropCancel();
    }
  };

  const onSubmit = async (data: SupporterGroupFormData) => {
    setLoading(true);
    setError(null);

    try {
      const adminSupabase = getAdminSupabaseClient();
      const supporterBucketEnv =
        process.env.NEXT_PUBLIC_SUPABASE_SUPPORTER_BUCKET?.trim();
      const supporterBucket =
        supporterBucketEnv && supporterBucketEnv.length > 0
          ? supporterBucketEnv
          : "supporters-photos";
      const rawSupporterFolder =
        process.env.NEXT_PUBLIC_SUPABASE_SUPPORTER_FOLDER?.trim();
      const supporterFolder =
        rawSupporterFolder && rawSupporterFolder.length > 0
          ? rawSupporterFolder
          : undefined;
      const prefix =
        supporterFolder && supporterFolder !== supporterBucket
          ? `${supporterFolder}/`
          : "";

      const updatedSupporters = [] as {
        name: string;
        title: string | null;
        focus: string | null;
        image_src: string;
      }[];

      for (let index = 0; index < data.supporters.length; index += 1) {
        const supporter = data.supporters[index];
        let finalImageSrc = supporter.imageSrc;
        const pendingFile = croppedFilesRef.current[index];

        if (pendingFile) {
          const fileExt =
            pendingFile.name.split(".")?.pop()?.toLowerCase() ?? "jpg";
          const sanitizedName = supporter.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/-+/g, "-")
            .replace(/(^-|-$)/g, "")
            .slice(0, 50);
          const baseName =
            sanitizedName.length > 0 ? sanitizedName : "supporter";
          const storagePath = `${prefix}${baseName}-${Date.now()}.${fileExt}`;

          const { error: uploadError } = await adminSupabase.storage
            .from(supporterBucket)
            .upload(storagePath, pendingFile, {
              cacheControl: "3600",
              upsert: true,
            });

          if (uploadError) {
            setError(
              uploadError.message?.includes("Bucket not found")
                ? `画像保存用バケット "${supporterBucket}" が存在しません。Supabase Storage で作成するか、NEXT_PUBLIC_SUPABASE_SUPPORTER_BUCKET を既存バケット名に設定してください。`
                : (uploadError.message ?? "画像のアップロードに失敗しました"),
            );
            setLoading(false);
            return;
          }

          const { data: publicUrlData } = adminSupabase.storage
            .from(supporterBucket)
            .getPublicUrl(storagePath);

          finalImageSrc = publicUrlData?.publicUrl ?? "";

          if (!finalImageSrc) {
            setError("公開URLの取得に失敗しました");
            setLoading(false);
            return;
          }

          setValue(`supporters.${index}.imageSrc`, finalImageSrc, {
            shouldValidate: true,
          });
        }

        updatedSupporters.push({
          name: supporter.name,
          title: supporter.title?.trim() ? supporter.title.trim() : null,
          focus: supporter.focus?.trim() ? supporter.focus.trim() : null,
          image_src: finalImageSrc,
        });
      }

      const supporterGroupData = {
        category: data.category,
        supporters: updatedSupporters,
      };

      if (initialData) {
        const { error: updateError } = await adminSupabase
          .from("investor_groups")
          .update(supporterGroupData)
          .eq("id", initialData.id);

        if (updateError) {
          setError(updateError.message);
          setLoading(false);
          return;
        }
      } else {
        const { error: insertError } = await adminSupabase
          .from("investor_groups")
          .insert(supporterGroupData);

        if (insertError) {
          setError(insertError.message);
          setLoading(false);
          return;
        }
      }

      router.push("/admin/supporters");
      router.refresh();
    } catch (_err) {
      setError("保存に失敗しました");
      setLoading(false);
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
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            カテゴリー <span className="text-red-500">*</span>
          </label>
          <input
            id="category"
            {...register("category")}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            placeholder="リードサポーター"
          />
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-neutral-700">
              サポーター <span className="text-red-500">*</span>
            </p>
            <button
              type="button"
              onClick={appendSupporterWithState}
              className="text-sm text-neutral-600 underline"
            >
              + 追加
            </button>
          </div>
          <div className="space-y-6">
            {supporterFields.map((field, index) => {
              const preview = previews[index];

              return (
                <div
                  key={field.id}
                  className="rounded-xl border border-neutral-200 p-4 sm:p-5"
                >
                  <div className="grid gap-4 sm:grid-cols-[auto,1fr] sm:gap-6">
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative h-24 w-24 overflow-hidden rounded-full border border-dashed border-neutral-300 bg-neutral-50">
                        {preview ? (
                          <Image
                            src={preview}
                            alt={`${field.id}-preview`}
                            fill
                            sizes="96px"
                            className="object-cover"
                            unoptimized={preview.startsWith("http")}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                            画像なし
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        className="rounded-lg border border-neutral-300 px-3 py-1 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
                        onClick={() => {
                          ensureStateLength(supporterFields.length);
                          const input = document.getElementById(
                            `supporter-image-${index}`,
                          ) as HTMLInputElement | null;
                          input?.click();
                        }}
                        disabled={loading}
                      >
                        {preview ? "画像を変更" : "画像をアップロード"}
                      </button>
                      <input
                        id={`supporter-image-${index}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect(index)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor={`supporter-name-${index}`}
                            className="mb-2 block text-sm font-medium text-neutral-700"
                          >
                            名前 <span className="text-red-500">*</span>
                          </label>
                          <input
                            id={`supporter-name-${index}`}
                            {...register(`supporters.${index}.name` as const)}
                            className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                            placeholder="North Star Ventures"
                          />
                          {errors.supporters?.[index]?.name && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.supporters[index]?.name?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor={`supporter-title-${index}`}
                            className="mb-2 block text-sm font-medium text-neutral-700"
                          >
                            タイトル
                          </label>
                          <input
                            id={`supporter-title-${index}`}
                            {...register(`supporters.${index}.title` as const)}
                            className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                            placeholder="Lead Investor"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor={`supporter-focus-${index}`}
                          className="mb-2 block text-sm font-medium text-neutral-700"
                        >
                          一言紹介
                        </label>
                        <textarea
                          id={`supporter-focus-${index}`}
                          {...register(`supporters.${index}.focus` as const)}
                          rows={3}
                          className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                          placeholder="Atlas のメモリレイヤーに最初期から関与し、成長を支援しています。"
                        />
                      </div>
                      <input
                        type="hidden"
                        {...register(`supporters.${index}.imageSrc` as const)}
                      />
                      {errors.supporters?.[index]?.imageSrc && (
                        <p className="text-sm text-red-600">
                          {errors.supporters[index]?.imageSrc?.message}
                        </p>
                      )}
                      {supporterFields.length > 1 && (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeSupporterWithState(index)}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            このサポーターを削除
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-neutral-900 px-6 py-2 font-medium text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "保存中..." : initialData ? "更新" : "作成"}
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

      {cropModalIndex !== null && imageForCrop ? (
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
                htmlFor="supporter-crop-zoom"
              >
                ズーム
              </label>
              <input
                id="supporter-crop-zoom"
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
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
