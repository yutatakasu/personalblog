"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";
import Image from "next/image";
import type { ContentBlock } from "@/models";

const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("paragraph"),
    text: z.string().min(1, "段落の内容を入力してください"),
  }),
  z.object({
    type: z.literal("image"),
    src: z.string().min(1, "画像URLを入力してください"),
    alt: z.string().min(1, "画像の説明を入力してください"),
  }),
]);

const newsSchema = z.object({
  id: z.string().min(1, "IDは必須です"),
  title: z.string().min(1, "タイトルは必須です"),
  subtitle: z.string().optional(),
  date: z.string().min(1, "日付は必須です"),
  thumbnailSrc: z.string().min(1, "サムネイル画像は必須です"),
  thumbnailAlt: z.string().min(1, "画像の説明は必須です"),
  link: z.string().min(1, "リンクは必須です"),
  content: z.array(contentBlockSchema).min(1, "少なくとも1つのコンテンツブロックが必要です"),
  summary: z.string().optional(),
  tag: z.string().optional(),
});

type NewsFormData = z.infer<typeof newsSchema>;

type NewsFormProps = {
  initialData?: {
    id: string;
    title: string;
    subtitle?: string;
    date: string;
    thumbnail_src: string;
    thumbnail_alt: string;
    link: string;
    content?: ContentBlock[];
    summary?: string;
    tag?: string;
  };
};

export function NewsForm({ initialData }: NewsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.thumbnail_src || null,
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: initialData
      ? {
          id: initialData.id,
          title: initialData.title,
          subtitle: initialData.subtitle || "",
          date: initialData.date,
          thumbnailSrc: initialData.thumbnail_src,
          thumbnailAlt: initialData.thumbnail_alt,
          link: initialData.link,
          content: initialData.content || [{ type: "paragraph", text: "" }],
          summary: initialData.summary || "",
          tag: initialData.tag || "",
        }
      : {
          content: [{ type: "paragraph", text: "" }],
          subtitle: "",
          summary: "",
          tag: "",
        },
  });

  const {
    fields: contentFields,
    append: appendContent,
    remove: removeContent,
    move: moveContent,
  } = useFieldArray({
    control,
    name: "content",
  });

  const thumbnailSrc = watch("thumbnailSrc");

  const onSubmit = async (data: NewsFormData) => {
    setLoading(true);
    setError(null);

    try {
      const adminSupabase = getAdminSupabaseClient();
      const newsData = {
        id: data.id,
        title: data.title,
        subtitle: data.subtitle || null,
        date: data.date,
        thumbnail_src: data.thumbnailSrc,
        thumbnail_alt: data.thumbnailAlt,
        link: data.link,
        content: data.content,
        summary: data.summary || null,
        tag: data.tag || null,
      };

      if (initialData) {
        // 更新
        const { error: updateError } = await adminSupabase
          .from("news")
          .update(newsData)
          .eq("id", data.id);

        if (updateError) {
          setError(updateError.message);
          setLoading(false);
          return;
        }
      } else {
        // 新規作成
        const { error: insertError } = await adminSupabase.from("news").insert(newsData);

        if (insertError) {
          setError(insertError.message);
          setLoading(false);
          return;
        }
      }

      router.push("/admin/news");
      router.refresh();
    } catch (err) {
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
        <label htmlFor="id" className="mb-2 block text-sm font-medium text-neutral-700">
          ID <span className="text-red-500">*</span>
        </label>
        <input
          id="id"
          {...register("id")}
          disabled={!!initialData}
          className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 disabled:bg-neutral-100"
          placeholder="atlas-os-v2-release"
        />
        {errors.id && <p className="mt-1 text-sm text-red-600">{errors.id.message}</p>}
        <p className="mt-1 text-xs text-neutral-500">
          URLに使用されるID（英数字とハイフンのみ、編集時は変更不可）
        </p>
      </div>

      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-medium text-neutral-700">
          タイトル <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          {...register("title")}
          className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          placeholder="Atlas OS v2 を正式リリース"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="subtitle" className="mb-2 block text-sm font-medium text-neutral-700">
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="mb-2 block text-sm font-medium text-neutral-700">
            日付 <span className="text-red-500">*</span>
          </label>
          <input
            id="date"
            {...register("date")}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            placeholder="2025.09.12"
          />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
        </div>

        <div>
          <label htmlFor="tag" className="mb-2 block text-sm font-medium text-neutral-700">
            タグ
          </label>
          <input
            id="tag"
            {...register("tag")}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            placeholder="Product Update"
          />
          {errors.tag && <p className="mt-1 text-sm text-red-600">{errors.tag.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="thumbnailSrc" className="mb-2 block text-sm font-medium text-neutral-700">
          サムネイル画像URL <span className="text-red-500">*</span>
        </label>
        <input
          id="thumbnailSrc"
          {...register("thumbnailSrc")}
          onChange={(e) => {
            setValue("thumbnailSrc", e.target.value);
            setImagePreview(e.target.value);
          }}
          className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          placeholder="/members_far_from.jpg"
        />
        {errors.thumbnailSrc && (
          <p className="mt-1 text-sm text-red-600">{errors.thumbnailSrc.message}</p>
        )}
        {imagePreview && (
          <div className="mt-4">
            <p className="mb-2 text-sm text-neutral-600">プレビュー:</p>
            <div className="relative h-48 w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                sizes="100%"
                className="object-cover"
                onError={() => setImagePreview(null)}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="thumbnailAlt" className="mb-2 block text-sm font-medium text-neutral-700">
          画像の説明 <span className="text-red-500">*</span>
        </label>
        <input
          id="thumbnailAlt"
          {...register("thumbnailAlt")}
          className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          placeholder="Atlas OS v2 product interface preview"
        />
        {errors.thumbnailAlt && (
          <p className="mt-1 text-sm text-red-600">{errors.thumbnailAlt.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="link" className="mb-2 block text-sm font-medium text-neutral-700">
          リンク <span className="text-red-500">*</span>
        </label>
        <input
          id="link"
          {...register("link")}
          className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          placeholder="/news/atlas-os-v2-release"
        />
        {errors.link && <p className="mt-1 text-sm text-red-600">{errors.link.message}</p>}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-neutral-700">
            内容 <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => appendContent({ type: "paragraph", text: "" })}
              className="text-sm text-neutral-600 underline"
            >
              + 段落を追加
            </button>
            <button
              type="button"
              onClick={() => appendContent({ type: "image", src: "", alt: "" })}
              className="text-sm text-neutral-600 underline"
            >
              + 画像を追加
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {contentFields.map((field, index) => {
            const blockType = watch(`content.${index}.type`);
            return (
              <div
                key={field.id}
                className="rounded-lg border border-neutral-200 bg-neutral-50 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-neutral-500">
                    {blockType === "paragraph" ? "段落" : "画像"} ({index + 1})
                  </span>
                  <div className="flex gap-2">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => moveContent(index, index - 1)}
                        className="text-xs text-neutral-600 underline"
                      >
                        上へ
                      </button>
                    )}
                    {index < contentFields.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveContent(index, index + 1)}
                        className="text-xs text-neutral-600 underline"
                      >
                        下へ
                      </button>
                    )}
                    {contentFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContent(index)}
                        className="text-xs text-red-600 underline"
                      >
                        削除
                      </button>
                    )}
                  </div>
                </div>
                {blockType === "paragraph" ? (
                  <textarea
                    {...register(`content.${index}.text` as const)}
                    rows={4}
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                    placeholder="段落の内容を入力してください"
                  />
                ) : (
                  <div className="space-y-2">
                    <input
                      {...register(`content.${index}.src` as const)}
                      className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                      placeholder="/path/to/image.jpg"
                    />
                    <input
                      {...register(`content.${index}.alt` as const)}
                      className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                      placeholder="画像の説明"
                    />
                    {watch(`content.${index}.src`) && (
                      <div className="relative h-32 w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                        <Image
                          src={watch(`content.${index}.src`)}
                          alt={watch(`content.${index}.alt`) || "Preview"}
                          fill
                          sizes="100%"
                          className="object-cover"
                          onError={() => {}}
                        />
                      </div>
                    )}
                  </div>
                )}
                {errors.content?.[index] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.content[index]?.message || "エラーがあります"}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="summary" className="mb-2 block text-sm font-medium text-neutral-700">
          概要（一覧表示用）
        </label>
        <textarea
          id="summary"
          {...register("summary")}
          rows={3}
          className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          placeholder="長期記憶に最適化したオーケストレーション機能と、監査可能なイベントタイムラインを追加しました。"
        />
        {errors.summary && <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>}
        <p className="mt-1 text-xs text-neutral-500">
          ニュース一覧ページで表示される短い概要です（オプション）
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
