"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Area } from "react-easy-crop";
import Cropper from "react-easy-crop";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { getCroppedImageBlob } from "@/lib/image-crop";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";
import type { ContentBlock } from "@/models";

const getFileExtension = (fileName: string, fallback = "jpg") => {
  const parts = fileName.split(".");
  const ext = parts.length > 1 ? parts.pop() : null;
  return ext ? ext.toLowerCase() : fallback;
};

const sanitizeForFileName = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 50);

const resolveStoragePrefix = (bucket: string, folder?: string) =>
  folder && folder.length > 0 && folder !== bucket ? `${folder}/` : "";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contentBlockSchema = z.object({
  title: z.string().trim().min(1, "段落タイトルを入力してください"),
  text: z.string().trim().min(1, "段落の内容を入力してください"),
  imageSrc: z.string().optional(),
});

const newsSchema = z.object({
  id: z.string().min(1, "IDは必須です"),
  title: z.string().trim().min(1, "タイトルは必須です"),
  subtitle: z.string().optional(),
  date: z.string().min(1, "日付は必須です"),
  thumbnailSrc: z.string().min(1, "サムネイル画像は必須です"),
  content: z
    .array(contentBlockSchema)
    .min(1, "少なくとも1つの段落を追加してください"),
  summary: z.string().optional(),
  contactEmail: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || value.length === 0 || emailRegex.test(value),
      "正しいメールアドレスを入力してください"
    ),
});

type NewsFormData = z.infer<typeof newsSchema>;

type NewsFormProps = {
  initialData?: {
    id: string;
    title: string;
    subtitle?: string | null;
    date: string;
    thumbnail_src: string;
    thumbnail_alt: string;
    link: string;
    content?: ContentBlock[];
    summary?: string | null;
    contact_email?: string | null;
  };
};

export function NewsForm({ initialData }: NewsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    initialData?.thumbnail_src ?? null
  );
  const [thumbnailObjectUrl, setThumbnailObjectUrl] = useState<string | null>(
    null
  );
  const [thumbnailCropModalOpen, setThumbnailCropModalOpen] = useState(false);
  const [thumbnailImageForCrop, setThumbnailImageForCrop] = useState<
    string | null
  >(null);
  const [thumbnailCrop, setThumbnailCrop] = useState({ x: 0, y: 0 });
  const [thumbnailZoom, setThumbnailZoom] = useState(1);
  const [thumbnailCropAreaPixels, setThumbnailCropAreaPixels] =
    useState<Area | null>(null);
  const [thumbnailSelectedFileName, setThumbnailSelectedFileName] = useState<
    string | null
  >(null);
  const thumbnailFileRef = useRef<File | null>(null);
  const thumbnailFileToCropRef = useRef<File | null>(null);
  const thumbnailFileInputRef = useRef<HTMLInputElement | null>(null);

  const initialContentPreviews =
    initialData?.content && initialData.content.length > 0
      ? initialData.content.map((block) => block.image?.src ?? "")
      : [""];
  const initialContentImageAlts =
    initialData?.content && initialData.content.length > 0
      ? initialData.content.map((block) => block.image?.alt ?? "")
      : new Array(initialContentPreviews.length).fill("");

  const [contentPreviews, setContentPreviews] = useState<string[]>(
    initialContentPreviews
  );
  const contentUploadedFilesRef = useRef<(File | null)[]>(
    new Array(initialContentPreviews.length).fill(null)
  );
  const contentImageAltCacheRef = useRef<string[]>([
    ...initialContentImageAlts,
  ]);
  const contentFileToCropRef = useRef<File | null>(null);
  const [contentCropModalIndex, setContentCropModalIndex] = useState<
    number | null
  >(null);
  const [contentImageForCrop, setContentImageForCrop] = useState<string | null>(
    null
  );
  const [contentCrop, setContentCrop] = useState({ x: 0, y: 0 });
  const [contentZoom, setContentZoom] = useState(1);
  const [contentCropAreaPixels, setContentCropAreaPixels] =
    useState<Area | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: initialData
      ? {
          id: initialData.id,
          title: initialData.title,
          subtitle: initialData.subtitle ?? "",
          date: initialData.date,
          thumbnailSrc: initialData.thumbnail_src,
          content:
            initialData.content && initialData.content.length > 0
              ? initialData.content.map((block) => ({
                  title: block.title ?? "",
                  text: block.text ?? "",
                  imageSrc: block.image?.src ?? "",
                }))
              : [{ title: "", text: "", imageSrc: "" }],
          summary: initialData.summary ?? "",
          contactEmail: initialData.contact_email ?? "",
        }
      : {
          id: "",
          title: "",
          subtitle: "",
          date: "",
          thumbnailSrc: "",
          content: [{ title: "", text: "", imageSrc: "" }],
          summary: "",
          contactEmail: "",
        },
  });

  const watchedId = watch("id");
  const normalizedIdForDisplay = watchedId?.trim() ?? "";

  const {
    fields: contentFields,
    append: appendContent,
    remove: removeContent,
    move: moveContent,
  } = useFieldArray({
    control,
    name: "content",
  });

  const ensureContentStateLength = useCallback((length: number) => {
    setContentPreviews((prev) => {
      const next = [...prev];
      while (next.length < length) {
        next.push("");
      }
      return next.slice(0, length);
    });

    while (contentUploadedFilesRef.current.length < length) {
      contentUploadedFilesRef.current.push(null);
    }
    contentUploadedFilesRef.current = contentUploadedFilesRef.current.slice(
      0,
      length
    );
    while (contentImageAltCacheRef.current.length < length) {
      contentImageAltCacheRef.current.push("");
    }
    contentImageAltCacheRef.current = contentImageAltCacheRef.current.slice(
      0,
      length
    );
  }, []);

  useEffect(() => {
    ensureContentStateLength(contentFields.length);
  }, [contentFields.length, ensureContentStateLength]);

  useEffect(() => {
    return () => {
      if (thumbnailObjectUrl) {
        URL.revokeObjectURL(thumbnailObjectUrl);
      }
      contentPreviews.forEach((preview) => {
        if (preview?.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [thumbnailObjectUrl, contentPreviews]);

  const handleThumbnailCropComplete = (_: Area, areaPixels: Area) => {
    setThumbnailCropAreaPixels(areaPixels);
  };

  const handleContentCropComplete = (_: Area, areaPixels: Area) => {
    setContentCropAreaPixels(areaPixels);
  };

  const handleThumbnailFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
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
      setThumbnailImageForCrop(reader.result as string);
      setThumbnailCrop({ x: 0, y: 0 });
      setThumbnailZoom(1);
      setThumbnailCropAreaPixels(null);
      setThumbnailCropModalOpen(true);
    };
    reader.readAsDataURL(file);

    thumbnailFileToCropRef.current = file;
    setThumbnailSelectedFileName(file.name);
  };

  const handleThumbnailCropCancel = () => {
    setThumbnailCropModalOpen(false);
    setThumbnailImageForCrop(null);
    setThumbnailCropAreaPixels(null);
    thumbnailFileToCropRef.current = null;
    setThumbnailSelectedFileName(null);
    if (thumbnailFileInputRef.current) {
      thumbnailFileInputRef.current.value = "";
    }
  };

  const handleThumbnailCropConfirm = async () => {
    if (!thumbnailImageForCrop || !thumbnailCropAreaPixels) {
      setError("サムネイル画像の切り抜き範囲を決定できませんでした");
      return;
    }

    try {
      const blob = await getCroppedImageBlob(
        thumbnailImageForCrop,
        thumbnailCropAreaPixels
      );
      const sourceFileName =
        thumbnailFileToCropRef.current?.name ??
        thumbnailSelectedFileName ??
        "thumbnail.jpg";
      const extension = getFileExtension(sourceFileName);
      const fileName = `thumbnail-${Date.now()}.${extension}`;
      const file = new File([blob], fileName, {
        type: blob.type || "image/jpeg",
      });

      if (thumbnailObjectUrl) {
        URL.revokeObjectURL(thumbnailObjectUrl);
      }

      thumbnailFileRef.current = file;
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
      setThumbnailObjectUrl(previewUrl);
      setValue("thumbnailSrc", previewUrl, { shouldValidate: true });
    } catch (cropError) {
      console.error(cropError);
      setError("サムネイル画像の切り抜きに失敗しました");
    } finally {
      handleThumbnailCropCancel();
    }
  };

  const handleContentFileSelect =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
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
        setContentImageForCrop(reader.result as string);
        setContentCrop({ x: 0, y: 0 });
        setContentZoom(1);
        setContentCropAreaPixels(null);
        setContentCropModalIndex(index);
      };
      reader.readAsDataURL(file);

      contentFileToCropRef.current = file;
    };

  const handleContentCropCancel = () => {
    const targetIndex = contentCropModalIndex;
    setContentCropModalIndex(null);
    setContentImageForCrop(null);
    setContentCropAreaPixels(null);
    contentFileToCropRef.current = null;
    if (typeof targetIndex === "number") {
      const input = document.getElementById(
        `content-image-${targetIndex}`
      ) as HTMLInputElement | null;
      if (input) {
        input.value = "";
      }
    }
  };

  const handleContentCropConfirm = async () => {
    if (
      contentCropModalIndex === null ||
      !contentImageForCrop ||
      !contentCropAreaPixels ||
      !contentFileToCropRef.current
    ) {
      setError("画像の切り抜き範囲を決定できませんでした");
      return;
    }

    const index = contentCropModalIndex;

    try {
      const blob = await getCroppedImageBlob(
        contentImageForCrop,
        contentCropAreaPixels
      );
      const sourceFileName =
        contentFileToCropRef.current.name ?? "section-image.jpg";
      const extension = getFileExtension(sourceFileName);
      const fileName = `section-${Date.now()}.${extension}`;
      const file = new File([blob], fileName, {
        type: blob.type || "image/jpeg",
      });

      const previousPreview = contentPreviews[index];
      if (previousPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(previousPreview);
      }

      contentUploadedFilesRef.current[index] = file;
      const previewUrl = URL.createObjectURL(file);
      setContentPreviews((prev) => {
        const next = [...prev];
        next[index] = previewUrl;
        return next;
      });
      setValue(`content.${index}.imageSrc`, previewUrl, {
        shouldValidate: true,
      });
      contentImageAltCacheRef.current[index] = "";
    } catch (cropError) {
      console.error(cropError);
      setError("画像の切り抜きに失敗しました");
    } finally {
      handleContentCropCancel();
    }
  };

  const handleRemoveContentImage = (index: number) => {
    const currentPreview = contentPreviews[index];
    if (currentPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(currentPreview);
    }

    contentUploadedFilesRef.current[index] = null;
    setContentPreviews((prev) => {
      const next = [...prev];
      next[index] = "";
      return next;
    });
    setValue(`content.${index}.imageSrc`, "", { shouldValidate: true });
    contentImageAltCacheRef.current[index] = "";

    const input = document.getElementById(
      `content-image-${index}`
    ) as HTMLInputElement | null;
    if (input) {
      input.value = "";
    }
  };

  const appendContentSection = () => {
    appendContent({ title: "", text: "", imageSrc: "" });
    ensureContentStateLength(contentFields.length + 1);
  };

  const removeContentSection = (index: number) => {
    if (contentFields.length <= 1) {
      return;
    }

    const removedPreview = contentPreviews[index];
    if (removedPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(removedPreview);
    }

    removeContent(index);
    setContentPreviews((prev) => prev.filter((_, i) => i !== index));
    contentUploadedFilesRef.current = contentUploadedFilesRef.current.filter(
      (_, i) => i !== index
    );
    contentImageAltCacheRef.current = contentImageAltCacheRef.current.filter(
      (_, i) => i !== index
    );
  };

  const moveContentSection = (from: number, to: number) => {
    moveContent(from, to);
    setContentPreviews((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    const files = contentUploadedFilesRef.current;
    const [movedFile] = files.splice(from, 1);
    files.splice(to, 0, movedFile);
    const alts = contentImageAltCacheRef.current;
    const [movedAlt] = alts.splice(from, 1);
    alts.splice(to, 0, movedAlt);
  };

  const onSubmit = async (data: NewsFormData) => {
    setLoading(true);
    setError(null);

    try {
      const adminSupabase = getAdminSupabaseClient();

      const newsBucketEnv =
        process.env.NEXT_PUBLIC_SUPABASE_NEWS_BUCKET?.trim();
      const newsBucket =
        newsBucketEnv && newsBucketEnv.length > 0
          ? newsBucketEnv
          : "news-photos";
      const newsFolderEnv =
        process.env.NEXT_PUBLIC_SUPABASE_NEWS_FOLDER?.trim();
      const newsFolder =
        newsFolderEnv && newsFolderEnv.length > 0 ? newsFolderEnv : undefined;
      const prefix = resolveStoragePrefix(newsBucket, newsFolder);

      const normalizedId = data.id.trim();
      const trimmedTitle = data.title.trim();
      const normalizedTitle =
        trimmedTitle.length > 0 ? trimmedTitle : normalizedId;
      const baseName = sanitizeForFileName(normalizedId);

      if (!normalizedId) {
        setError("IDを入力してください");
        setLoading(false);
        return;
      }

      setValue("id", normalizedId);

      let finalThumbnailSrc = data.thumbnailSrc?.trim() ?? "";
      const thumbnailFile = thumbnailFileRef.current;

      if (thumbnailFile) {
        const extension = getFileExtension(thumbnailFile.name);
        const storagePath = `${prefix}${
          baseName || "news-item"
        }-thumbnail-${Date.now()}.${extension}`;

        const { error: uploadError } = await adminSupabase.storage
          .from(newsBucket)
          .upload(storagePath, thumbnailFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          setError(
            uploadError.message?.includes("Bucket not found")
              ? `画像保存用バケット "${newsBucket}" が存在しません。Supabase Storage で作成するか、NEXT_PUBLIC_SUPABASE_NEWS_BUCKET を既存バケット名に設定してください。`
              : uploadError.message ??
                  "サムネイル画像のアップロードに失敗しました"
          );
          setLoading(false);
          return;
        }

        const { data: publicUrlData } = adminSupabase.storage
          .from(newsBucket)
          .getPublicUrl(storagePath);

        finalThumbnailSrc = publicUrlData?.publicUrl ?? "";

        if (!finalThumbnailSrc) {
          setError("サムネイル画像の公開URLの取得に失敗しました");
          setLoading(false);
          return;
        }

        setValue("thumbnailSrc", finalThumbnailSrc, { shouldValidate: true });
        thumbnailFileRef.current = null;
      }

      if (!finalThumbnailSrc) {
        setError("サムネイル画像を設定してください");
        setLoading(false);
        return;
      }

      const formattedContent: ContentBlock[] = [];
      const thumbnailAltValue =
        (initialData?.thumbnail_alt?.trim().length
          ? initialData.thumbnail_alt.trim()
          : "") || normalizedTitle;

      for (let index = 0; index < data.content.length; index += 1) {
        const block = data.content[index];
        let imageSrc = block.imageSrc?.trim() ?? "";
        const pendingFile = contentUploadedFilesRef.current[index];

        if (pendingFile) {
          const extension = getFileExtension(pendingFile.name);
          const storagePath = `${prefix}${baseName || "news-item"}-section-${
            index + 1
          }-${Date.now()}.${extension}`;

          const { error: uploadError } = await adminSupabase.storage
            .from(newsBucket)
            .upload(storagePath, pendingFile, {
              cacheControl: "3600",
              upsert: true,
            });

          if (uploadError) {
            setError(
              uploadError.message?.includes("Bucket not found")
                ? `画像保存用バケット "${newsBucket}" が存在しません。Supabase Storage で作成するか、NEXT_PUBLIC_SUPABASE_NEWS_BUCKET を既存バケット名に設定してください。`
                : uploadError.message ?? "段落画像のアップロードに失敗しました"
            );
            setLoading(false);
            return;
          }

          const { data: publicUrlData } = adminSupabase.storage
            .from(newsBucket)
            .getPublicUrl(storagePath);

          imageSrc = publicUrlData?.publicUrl ?? "";

          if (!imageSrc) {
            setError("段落画像の公開URLの取得に失敗しました");
            setLoading(false);
            return;
          }

          setValue(`content.${index}.imageSrc`, imageSrc, {
            shouldValidate: true,
          });
          contentUploadedFilesRef.current[index] = null;
        }

        const cachedAlt = contentImageAltCacheRef.current[index] ?? "";
        const computedAlt =
          cachedAlt && cachedAlt.trim().length > 0
            ? cachedAlt.trim()
            : block.title.trim().length > 0
            ? block.title.trim()
            : normalizedTitle;

        contentImageAltCacheRef.current[index] = computedAlt;

        formattedContent.push({
          title: block.title.trim(),
          text: block.text,
          image: imageSrc
            ? {
                src: imageSrc,
                alt: computedAlt,
              }
            : null,
        });
      }

      const contactEmailRaw = data.contactEmail ?? "";
      const contactEmailValue =
        contactEmailRaw && contactEmailRaw.length > 0 ? contactEmailRaw : null;

      const finalLink = `/news/${normalizedId}`;
      const newsData = {
        id: normalizedId,
        title: normalizedTitle,
        subtitle: data.subtitle?.trim() ? data.subtitle.trim() : null,
        date: data.date,
        thumbnail_src: finalThumbnailSrc,
        thumbnail_alt: thumbnailAltValue,
        link: finalLink,
        content: formattedContent,
        summary: data.summary?.trim() ? data.summary.trim() : null,
        contact_email: contactEmailValue,
      };

      if (initialData) {
        const { error: updateError } = await adminSupabase
          .from("news")
          .update(newsData)
          .eq("id", normalizedId);

        if (updateError) {
          setError(updateError.message);
          setLoading(false);
          return;
        }
      } else {
        const { error: insertError } = await adminSupabase
          .from("news")
          .insert(newsData);

        if (insertError) {
          setError(insertError.message);
          setLoading(false);
          return;
        }
      }

      router.push("/admin/news");
      router.refresh();
    } catch (submitError) {
      console.error(submitError);
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
            placeholder="atlas-os-v2-release"
          />
          {errors.id && (
            <p className="mt-1 text-sm text-red-600">{errors.id.message}</p>
          )}
          <p className="mt-1 text-xs text-neutral-500">
            URLに使用されるID（英数字とハイフンのみ、編集時は変更不可）
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            公開URL:{" "}
            {normalizedIdForDisplay
              ? `/news/${normalizedIdForDisplay}`
              : "/news/<id>"}
          </p>
        </div>

        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            {...register("title")}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            placeholder="Atlas OS v2 を正式リリース"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="subtitle"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            サブタイトル
          </label>
          <input
            id="subtitle"
            {...register("subtitle")}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            placeholder="長期記憶に最適化した新機能を追加"
          />
          {errors.subtitle && (
            <p className="mt-1 text-sm text-red-600">
              {errors.subtitle.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="date"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            日付 <span className="text-red-500">*</span>
          </label>
          <input
            id="date"
            {...register("date")}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            placeholder="2025.09.12"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        <input type="hidden" {...register("thumbnailSrc")} />

        <div>
          <p className="mb-2 text-sm font-medium text-neutral-700">
            サムネイル画像 <span className="text-red-500">*</span>
          </p>
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
              <div className="relative aspect-[16/9] w-full">
                {thumbnailPreview ? (
                  <Image
                    src={thumbnailPreview}
                    alt="サムネイルプレビュー"
                    fill
                    sizes="100%"
                    className="object-cover"
                    onError={() => setThumbnailPreview(null)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                    プレビューなし
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
                onClick={() => thumbnailFileInputRef.current?.click()}
                disabled={loading}
              >
                {thumbnailPreview
                  ? "サムネイルを変更"
                  : "サムネイルをアップロード"}
              </button>
              <input
                ref={thumbnailFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleThumbnailFileSelect}
                disabled={loading}
              />
            </div>
            {errors.thumbnailSrc && (
              <p className="text-sm text-red-600">
                {errors.thumbnailSrc.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-neutral-700">
            段落 <span className="text-red-500">*</span>
          </p>
          <div className="space-y-6">
            {contentFields.map((field, index) => {
              const imageSrc = watch(`content.${index}.imageSrc`);
              const hasImage = !!imageSrc && imageSrc.trim().length > 0;

              return (
                <div
                  key={field.id}
                  className="rounded-xl border border-neutral-200 p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-400">
                      Section {index + 1}
                    </span>
                    <div className="flex gap-2">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => moveContentSection(index, index - 1)}
                          className="text-xs text-neutral-600 underline"
                        >
                          上へ
                        </button>
                      )}
                      {index < contentFields.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveContentSection(index, index + 1)}
                          className="text-xs text-neutral-600 underline"
                        >
                          下へ
                        </button>
                      )}
                      {contentFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeContentSection(index)}
                          className="text-xs text-red-600 underline"
                        >
                          削除
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label
                        htmlFor={`content-title-${index}`}
                        className="mb-1 block text-xs font-medium text-neutral-600"
                      >
                        段落タイトル <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`content-title-${index}`}
                        {...register(`content.${index}.title` as const)}
                        className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                        placeholder="段落タイトルを入力してください"
                      />
                      {errors.content?.[index]?.title && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.content[index]?.title?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <textarea
                        {...register(`content.${index}.text` as const)}
                        rows={4}
                        className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                        placeholder="段落の内容を入力してください"
                      />
                      {errors.content?.[index]?.text && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.content[index]?.text?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="relative overflow-hidden rounded-2xl border border-dashed border-neutral-300 bg-neutral-50">
                        <div className="relative aspect-[16/9] w-full">
                          {contentPreviews[index] ? (
                            <Image
                              src={contentPreviews[index]}
                              alt={`段落${index + 1}の画像プレビュー`}
                              fill
                              sizes="100%"
                              className="object-cover"
                              onError={() => {
                                setContentPreviews((prev) => {
                                  const next = [...prev];
                                  next[index] = "";
                                  return next;
                                });
                                setValue(`content.${index}.imageSrc`, "", {
                                  shouldValidate: true,
                                });
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                              画像プレビューなし
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
                          onClick={() => {
                            const input = document.getElementById(
                              `content-image-${index}`
                            ) as HTMLInputElement | null;
                            input?.click();
                          }}
                          disabled={loading}
                        >
                          {hasImage ? "画像を変更" : "画像を追加"}
                        </button>
                        {hasImage && (
                          <button
                            type="button"
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                            onClick={() => handleRemoveContentImage(index)}
                            disabled={loading}
                          >
                            画像を削除
                          </button>
                        )}
                        <input
                          id={`content-image-${index}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleContentFileSelect(index)}
                          disabled={loading}
                        />
                      </div>
                      <input
                        type="hidden"
                        {...register(`content.${index}.imageSrc` as const)}
                      />
                      {errors.content?.[index]?.imageSrc && (
                        <p className="text-sm text-red-600">
                          {errors.content[index]?.imageSrc?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">
              {errors.content.message}
            </p>
          )}
          <div className="py-5 mt-4 flex justify-end">
            <button
              type="button"
              onClick={appendContentSection}
              className="text-sm text-neutral-600 underline"
            >
              + 段落を追加
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="summary"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            概要（一覧表示用）
          </label>
          <textarea
            id="summary"
            {...register("summary")}
            rows={3}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            placeholder="長期記憶に最適化したオーケストレーション機能と、監査可能なイベントタイムラインを追加しました。"
          />
          {errors.summary && (
            <p className="mt-1 text-sm text-red-600">
              {errors.summary.message}
            </p>
          )}
          <p className="mt-1 text-xs text-neutral-500">
            ニュース一覧ページで表示される短い概要です（オプション）
          </p>
        </div>

        <div>
          <label
            htmlFor="contactEmail"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            お問い合わせメールアドレス
          </label>
          <input
            id="contactEmail"
            {...register("contactEmail")}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            placeholder="press@atlas.inc"
          />
          {errors.contactEmail && (
            <p className="mt-1 text-sm text-red-600">
              {errors.contactEmail.message}
            </p>
          )}
          <p className="mt-1 text-xs text-neutral-500">
            記事の末尾に「この記事に関してのお問い合わせは:
            メールアドレス」を表示します（任意）
          </p>
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

      {thumbnailCropModalOpen && thumbnailImageForCrop ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-neutral-900">
              <Cropper
                image={thumbnailImageForCrop}
                crop={thumbnailCrop}
                zoom={thumbnailZoom}
                aspect={16 / 9}
                cropShape="rect"
                showGrid={false}
                onCropChange={setThumbnailCrop}
                onZoomChange={setThumbnailZoom}
                onCropComplete={handleThumbnailCropComplete}
              />
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <label
                className="text-sm font-medium text-neutral-600"
                htmlFor="thumbnail-zoom"
              >
                ズーム
              </label>
              <input
                id="thumbnail-zoom"
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={thumbnailZoom}
                onChange={(event) =>
                  setThumbnailZoom(Number(event.target.value))
                }
                className="flex-1"
              />
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
                  onClick={handleThumbnailCropCancel}
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
                  onClick={handleThumbnailCropConfirm}
                >
                  この範囲を使用
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {contentCropModalIndex !== null && contentImageForCrop ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-neutral-900">
              <Cropper
                image={contentImageForCrop}
                crop={contentCrop}
                zoom={contentZoom}
                aspect={16 / 9}
                cropShape="rect"
                showGrid={false}
                onCropChange={setContentCrop}
                onZoomChange={setContentZoom}
                onCropComplete={handleContentCropComplete}
              />
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <label
                className="text-sm font-medium text-neutral-600"
                htmlFor="content-zoom"
              >
                ズーム
              </label>
              <input
                id="content-zoom"
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={contentZoom}
                onChange={(event) => setContentZoom(Number(event.target.value))}
                className="flex-1"
              />
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
                  onClick={handleContentCropCancel}
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
                  onClick={handleContentCropConfirm}
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
