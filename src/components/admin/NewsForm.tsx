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
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

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

const contentImageSchema = z.object({
  src: z.string().trim().min(1),
  alt: z.string().trim().optional(),
});

const contentBlockSchema = z.object({
  title: z.string().trim().optional(),
  text: z.string().trim().min(1, "段落の内容を入力してください"),
  images: z.array(contentImageSchema).default([]),
});

const newsSchema = z.object({
  id: z.string().min(1, "IDは必須です"),
  title: z.string().trim().min(1, "タイトルは必須です"),
  subtitle: z.string().optional(),
  date: z.string().min(1, "日付は必須です"),
  thumbnailSrc: z.string().optional(),
  content: z
    .array(contentBlockSchema)
    .min(1, "少なくとも1つの段落を追加してください"),
  summary: z.string().optional(),
  contactPerson: z.string().trim().optional(),
  contactEmail: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || value.length === 0 || emailRegex.test(value),
      "正しいメールアドレスを入力してください",
    ),
  category: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

type NewsFormData = z.input<typeof newsSchema>;

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
    contact_person?: string | null;
    contact_email?: string | null;
    category?: string | null;
    status?: string | null;
  };
};

export function NewsForm({ initialData }: NewsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    initialData?.thumbnail_src ?? null,
  );
  const [thumbnailObjectUrl, setThumbnailObjectUrl] = useState<string | null>(
    null,
  );
  const thumbnailFileRef = useRef<File | null>(null);
  const thumbnailFileInputRef = useRef<HTMLInputElement | null>(null);
  const thumbnailObjectUrlRef = useRef<string | null>(null);

  const initialContentPreviews =
    initialData?.content && initialData.content.length > 0
      ? initialData.content.map((block) =>
          (block.images ?? []).map((image) => image.src ?? ""),
        )
      : [[]];
  const initialContentImageAlts =
    initialData?.content && initialData.content.length > 0
      ? initialData.content.map((block) =>
          (block.images ?? []).map((image) => image.alt ?? ""),
        )
      : initialContentPreviews.map(() => []);

  const [contentPreviews, setContentPreviews] = useState<string[][]>(
    initialContentPreviews,
  );
  const contentPreviewsRef = useRef<string[][]>(initialContentPreviews);
  const contentUploadedFilesRef = useRef<(File | null)[][]>(
    initialContentPreviews.map((blockPreviews) =>
      blockPreviews.map(() => null),
    ),
  );
  const contentImageAltCacheRef = useRef<string[][]>(
    initialContentImageAlts.map((alts) => [...alts]),
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    getValues,
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
                  images:
                    block.images && block.images.length > 0
                      ? block.images.map((image) => ({
                          src: image.src,
                          alt: image.alt,
                        }))
                      : [],
                }))
              : [{ title: "", text: "", images: [] }],
          summary: initialData.summary ?? "",
          contactPerson: initialData.contact_person ?? "",
          contactEmail: initialData.contact_email ?? "",
          category: initialData.category ?? "",
          status: (initialData.status as "draft" | "published") ?? "draft",
        }
      : {
          id: "",
          title: "",
          subtitle: "",
          date: "",
          thumbnailSrc: "",
          content: [{ title: "", text: "", images: [] }],
          summary: "",
          contactPerson: "",
          contactEmail: "",
          category: "",
          status: "draft" as const,
        },
  });

  const watchedId = watch("id");
  const normalizedIdForDisplay = watchedId?.trim() ?? "";
  const watchedThumbnailSrc = watch("thumbnailSrc");
  const hasThumbnailValue =
    typeof watchedThumbnailSrc === "string" &&
    watchedThumbnailSrc.trim().length > 0;

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
        next.push([]);
      }
      return next.slice(0, length);
    });

    while (contentUploadedFilesRef.current.length < length) {
      contentUploadedFilesRef.current.push([]);
    }
    contentUploadedFilesRef.current = contentUploadedFilesRef.current.slice(
      0,
      length,
    );

    while (contentImageAltCacheRef.current.length < length) {
      contentImageAltCacheRef.current.push([]);
    }
    contentImageAltCacheRef.current = contentImageAltCacheRef.current.slice(
      0,
      length,
    );
  }, []);

  useEffect(() => {
    ensureContentStateLength(contentFields.length);
  }, [contentFields.length, ensureContentStateLength]);

  useEffect(() => {
    contentPreviewsRef.current = contentPreviews;
  }, [contentPreviews]);

  useEffect(() => {
    return () => {
      const currentThumbnail = thumbnailObjectUrlRef.current;
      if (currentThumbnail) {
        URL.revokeObjectURL(currentThumbnail);
      }
      contentPreviewsRef.current.forEach((blockPreviews) => {
        blockPreviews.forEach((preview) => {
          if (preview?.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
          }
        });
      });
    };
  }, []);

  const handleThumbnailFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("画像ファイルを選択してください");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (thumbnailObjectUrl) {
      URL.revokeObjectURL(thumbnailObjectUrl);
    } else if (thumbnailPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    thumbnailFileRef.current = file;
    setThumbnailPreview(previewUrl);
    setThumbnailObjectUrl(previewUrl);
    thumbnailObjectUrlRef.current = previewUrl;
    setValue("thumbnailSrc", previewUrl, { shouldValidate: true });
  };

  const handleRemoveThumbnail = () => {
    if (thumbnailObjectUrl) {
      URL.revokeObjectURL(thumbnailObjectUrl);
      setThumbnailObjectUrl(null);
    } else if (thumbnailPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    setThumbnailPreview(null);
    thumbnailFileRef.current = null;
    if (thumbnailFileInputRef.current) {
      thumbnailFileInputRef.current.value = "";
    }
    setValue("thumbnailSrc", "", { shouldValidate: true });
    thumbnailObjectUrlRef.current = null;
  };

  const handleContentFileSelect =
    (blockIndex: number, imageIndex: number | null) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("画像ファイルを選択してください");
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      const existingPreview =
        imageIndex === null
          ? undefined
          : contentPreviews[blockIndex]?.[imageIndex];
      if (existingPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(existingPreview);
      }

      setContentPreviews((prev) => {
        const next = prev.map((block) => [...block]);
        while (next.length <= blockIndex) {
          next.push([]);
        }
        if (imageIndex === null) {
          next[blockIndex].push(previewUrl);
        } else {
          next[blockIndex][imageIndex] = previewUrl;
        }
        return next;
      });

      while (contentUploadedFilesRef.current.length <= blockIndex) {
        contentUploadedFilesRef.current.push([]);
      }
      const blockFiles = contentUploadedFilesRef.current[blockIndex];
      if (imageIndex === null) {
        blockFiles.push(file);
      } else {
        blockFiles[imageIndex] = file;
      }
      contentUploadedFilesRef.current[blockIndex] = blockFiles;

      while (contentImageAltCacheRef.current.length <= blockIndex) {
        contentImageAltCacheRef.current.push([]);
      }
      const blockAlts = contentImageAltCacheRef.current[blockIndex];
      if (imageIndex === null) {
        blockAlts.push("");
      } else {
        blockAlts[imageIndex] = "";
      }
      contentImageAltCacheRef.current[blockIndex] = blockAlts;

      if (imageIndex === null) {
        const currentImages = getValues(`content.${blockIndex}.images`) ?? [];
        const nextImages = [
          ...currentImages,
          {
            src: previewUrl,
            alt: "",
          },
        ];
        setValue(`content.${blockIndex}.images`, nextImages, {
          shouldValidate: true,
        });
      } else {
        setValue(`content.${blockIndex}.images.${imageIndex}.src`, previewUrl, {
          shouldValidate: true,
        });
        setValue(`content.${blockIndex}.images.${imageIndex}.alt`, "", {
          shouldValidate: false,
        });
      }

      event.target.value = "";
    };

  const handleRemoveContentImage = (blockIndex: number, imageIndex: number) => {
    const blockPreviews = contentPreviews[blockIndex] ?? [];
    const targetPreview = blockPreviews[imageIndex];
    if (targetPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(targetPreview);
    }

    setContentPreviews((prev) => {
      const next = prev.map((images) => [...images]);
      next[blockIndex]?.splice(imageIndex, 1);
      return next;
    });

    const blockFiles = contentUploadedFilesRef.current[blockIndex] ?? [];
    blockFiles.splice(imageIndex, 1);
    contentUploadedFilesRef.current[blockIndex] = blockFiles;

    const blockAlts = contentImageAltCacheRef.current[blockIndex] ?? [];
    blockAlts.splice(imageIndex, 1);
    contentImageAltCacheRef.current[blockIndex] = blockAlts;

    const currentImages = getValues(`content.${blockIndex}.images`) ?? [];
    const nextImages = currentImages.filter((_, idx) => idx !== imageIndex);
    setValue(`content.${blockIndex}.images`, nextImages, {
      shouldValidate: true,
    });

    const input = document.getElementById(
      `content-image-${blockIndex}-${imageIndex}`,
    ) as HTMLInputElement | null;
    if (input) {
      input.value = "";
    }
  };

  const appendContentSection = () => {
    appendContent({ title: "", text: "", images: [] });
    ensureContentStateLength(contentFields.length + 1);
  };

  const removeContentSection = (index: number) => {
    if (contentFields.length <= 1) {
      return;
    }

    const removedPreviews = contentPreviews[index] ?? [];
    removedPreviews.forEach((preview) => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    });

    removeContent(index);
    setContentPreviews((prev) => prev.filter((_, i) => i !== index));
    contentUploadedFilesRef.current = contentUploadedFilesRef.current.filter(
      (_, i) => i !== index,
    );
    contentImageAltCacheRef.current = contentImageAltCacheRef.current.filter(
      (_, i) => i !== index,
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
    const [movedFiles] = files.splice(from, 1);
    files.splice(to, 0, movedFiles);
    const alts = contentImageAltCacheRef.current;
    const [movedAlts] = alts.splice(from, 1);
    alts.splice(to, 0, movedAlts);
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
              : (uploadError.message ??
                  "サムネイル画像のアップロードに失敗しました"),
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

      const formattedContent: ContentBlock[] = [];
      const thumbnailAltValue =
        (initialData?.thumbnail_alt?.trim().length
          ? initialData.thumbnail_alt.trim()
          : "") || normalizedTitle;

      for (
        let blockIndex = 0;
        blockIndex < data.content.length;
        blockIndex += 1
      ) {
        const block = data.content[blockIndex];
        const blockTitle = block.title?.trim() ?? "";
        const blockImages = Array.isArray(block.images) ? block.images : [];

        if (!contentUploadedFilesRef.current[blockIndex]) {
          contentUploadedFilesRef.current[blockIndex] = new Array(
            blockImages.length,
          ).fill(null);
        } else {
          const files = contentUploadedFilesRef.current[blockIndex];
          while (files.length < blockImages.length) {
            files.push(null);
          }
          contentUploadedFilesRef.current[blockIndex] = files.slice(
            0,
            blockImages.length,
          );
        }

        if (!contentImageAltCacheRef.current[blockIndex]) {
          contentImageAltCacheRef.current[blockIndex] = new Array(
            blockImages.length,
          ).fill("");
        } else {
          const cache = contentImageAltCacheRef.current[blockIndex];
          while (cache.length < blockImages.length) {
            cache.push("");
          }
          contentImageAltCacheRef.current[blockIndex] = cache.slice(
            0,
            blockImages.length,
          );
        }

        const normalizedImages: ContentBlock["images"] = [];

        for (
          let imageIndex = 0;
          imageIndex < blockImages.length;
          imageIndex += 1
        ) {
          const imageEntry = blockImages[imageIndex];
          let imageSrc = imageEntry?.src?.trim() ?? "";
          const pendingFile =
            contentUploadedFilesRef.current[blockIndex]?.[imageIndex] ?? null;

          if (pendingFile) {
            const extension = getFileExtension(pendingFile.name);
            const storagePath = `${prefix}${baseName || "news-item"}-section-${
              blockIndex + 1
            }-${imageIndex + 1}-${Date.now()}.${extension}`;

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
                  : (uploadError.message ??
                      "段落画像のアップロードに失敗しました"),
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

            setValue(
              `content.${blockIndex}.images.${imageIndex}.src`,
              imageSrc,
              { shouldValidate: true },
            );
            contentUploadedFilesRef.current[blockIndex][imageIndex] = null;
            blockImages[imageIndex].src = imageSrc;
          }

          if (!imageSrc) {
            continue;
          }

          const altCache = contentImageAltCacheRef.current[blockIndex] ?? [];
          const cachedAlt =
            altCache[imageIndex]?.trim() ?? imageEntry?.alt?.trim() ?? "";
          const computedAlt =
            cachedAlt && cachedAlt.length > 0
              ? cachedAlt
              : blockTitle && blockTitle.length > 0
                ? blockTitle
                : normalizedTitle;

          altCache[imageIndex] = computedAlt;
          contentImageAltCacheRef.current[blockIndex] = altCache;

          setValue(
            `content.${blockIndex}.images.${imageIndex}.alt`,
            computedAlt,
            { shouldValidate: false },
          );

          normalizedImages.push({
            src: imageSrc,
            alt: computedAlt,
          });
        }

        formattedContent.push({
          title: blockTitle.length > 0 ? blockTitle : undefined,
          text: block.text,
          images: normalizedImages,
        });
      }

      const contactEmailRaw = data.contactEmail ?? "";
      const contactEmailValue =
        contactEmailRaw && contactEmailRaw.length > 0 ? contactEmailRaw : null;
      const contactPersonRaw = data.contactPerson ?? "";
      const contactPersonValue =
        contactPersonRaw && contactPersonRaw.length > 0
          ? contactPersonRaw
          : null;

      const finalLink = `/posts/${normalizedId}`;
      const newsData = {
        id: normalizedId,
        title: normalizedTitle,
        subtitle: data.subtitle?.trim() ? data.subtitle.trim() : null,
        date: data.date,
        thumbnail_src: finalThumbnailSrc || null,
        thumbnail_alt: finalThumbnailSrc ? thumbnailAltValue : "",
        link: finalLink,
        content: formattedContent,
        summary: data.summary?.trim() ? data.summary.trim() : null,
        contact_person: contactPersonValue,
        contact_email: contactEmailValue,
        category: data.category?.trim() ? data.category.trim() : null,
        status: data.status,
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
            ? `/posts/${normalizedIdForDisplay}`
            : "/posts/<id>"}
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
          <p className="mt-1 text-sm text-red-600">{errors.subtitle.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            カテゴリー
          </label>
          <input
            id="category"
            {...register("category")}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            placeholder="技術、日記、レビューなど"
          />
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            ステータス <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            {...register("status")}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          >
            <option value="draft">下書き</option>
            <option value="published">公開</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
          <p className="mt-1 text-xs text-neutral-500">
            「公開」にするとブログに表示されます
          </p>
        </div>
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
          サムネイル画像
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
            {hasThumbnailValue ? (
              <button
                type="button"
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                onClick={handleRemoveThumbnail}
                disabled={loading}
              >
                サムネイルを削除
              </button>
            ) : null}
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
            const images = watch(`content.${index}.images`) ?? [];

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
                      段落タイトル
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

                  <div className="space-y-4">
                    {images.length > 0 ? (
                      images.map((image, imageIndex) => {
                        const previewSrc =
                          contentPreviews[index]?.[imageIndex] ??
                          image?.src ??
                          "";
                        return (
                          <div
                            key={`${field.id}-image-${imageIndex}`}
                            className="rounded-xl border border-neutral-200 bg-white p-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
                                Image {imageIndex + 1}
                              </span>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  className="text-xs text-neutral-600 underline"
                                  onClick={() => {
                                    const input = document.getElementById(
                                      `content-image-${index}-${imageIndex}`,
                                    ) as HTMLInputElement | null;
                                    input?.click();
                                  }}
                                  disabled={loading}
                                >
                                  画像を変更
                                </button>
                                <button
                                  type="button"
                                  className="text-xs text-red-600 underline"
                                  onClick={() =>
                                    handleRemoveContentImage(index, imageIndex)
                                  }
                                  disabled={loading}
                                >
                                  削除
                                </button>
                              </div>
                            </div>
                            <div className="mt-3 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
                              <div className="relative aspect-[16/9] w-full">
                                {previewSrc ? (
                                  <Image
                                    src={previewSrc}
                                    alt={`段落${index + 1}の画像${imageIndex + 1}プレビュー`}
                                    fill
                                    sizes="100%"
                                    className="object-cover"
                                    onError={() => {
                                      setContentPreviews((prev) => {
                                        const next = prev.map((block) => [
                                          ...block,
                                        ]);
                                        next[index][imageIndex] = "";
                                        return next;
                                      });
                                      setValue(
                                        `content.${index}.images.${imageIndex}.src`,
                                        "",
                                        { shouldValidate: true },
                                      );
                                    }}
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                                    画像プレビューなし
                                  </div>
                                )}
                              </div>
                            </div>
                            <input
                              id={`content-image-${index}-${imageIndex}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleContentFileSelect(
                                index,
                                imageIndex,
                              )}
                              disabled={loading}
                            />
                            <input
                              type="hidden"
                              {...register(
                                `content.${index}.images.${imageIndex}.src` as const,
                              )}
                            />
                            <input
                              type="hidden"
                              {...register(
                                `content.${index}.images.${imageIndex}.alt` as const,
                              )}
                            />
                          </div>
                        );
                      })
                    ) : (
                      <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center text-xs text-neutral-400">
                        画像が追加されていません
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
                        onClick={() => {
                          const input = document.getElementById(
                            `content-image-${index}-new`,
                          ) as HTMLInputElement | null;
                          input?.click();
                        }}
                        disabled={loading}
                      >
                        + 画像を追加
                      </button>
                      <input
                        id={`content-image-${index}-new`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleContentFileSelect(index, null)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
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
          <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
        )}
        <p className="mt-1 text-xs text-neutral-500">
          ニュース一覧ページで表示される短い概要です（オプション）
        </p>
      </div>

      <div>
        <label
          htmlFor="contactPerson"
          className="mb-2 block text-sm font-medium text-neutral-700"
        >
          お問い合わせ担当者
        </label>
        <input
          id="contactPerson"
          {...register("contactPerson")}
          className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          placeholder="熊谷 流気（プロジェクト担当）"
        />
        <p className="mt-1 text-xs text-neutral-500">
          記事末尾に担当者名として表示されます（任意）
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
          記事末尾に担当者名とメールアドレスを表示します（任意）
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
  );
}
