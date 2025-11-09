"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";
import Image from "next/image";

const teamMemberSchema = z.object({
  id: z.string().min(1, "IDは必須です"),
  name: z.string().min(1, "名前は必須です"),
  title: z.string().min(1, "役職は必須です"),
  focus: z.string().min(1, "フォーカスは必須です"),
  imageSrc: z.string().min(1, "画像URLは必須です"),
  imageAlt: z.string().optional(),
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: initialData
      ? {
          id: initialData.id,
          name: initialData.name,
          title: initialData.title,
          focus: initialData.focus,
          imageSrc: initialData.image_src,
          imageAlt: initialData.image_alt || "",
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

  const imageSrc = watch("imageSrc");

  const onSubmit = async (data: TeamMemberFormData) => {
    setLoading(true);
    setError(null);

    try {
      const adminSupabase = getAdminSupabaseClient();
      const teamMemberData = {
        id: data.id,
        name: data.name,
        title: data.title,
        focus: data.focus,
        image_src: data.imageSrc,
        image_alt: data.imageAlt || null,
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
          placeholder="yuki-miyazaki"
        />
        {errors.id && <p className="mt-1 text-sm text-red-600">{errors.id.message}</p>}
        <p className="mt-1 text-xs text-neutral-500">
          URLに使用されるID（英数字とハイフンのみ、編集時は変更不可）
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-neutral-700">
            名前 <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            {...register("name")}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            placeholder="Yuki Miyazaki"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium text-neutral-700">
            役職 <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            {...register("title")}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            placeholder="Founder & CEO"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="focus" className="mb-2 block text-sm font-medium text-neutral-700">
          フォーカス <span className="text-red-500">*</span>
        </label>
        <textarea
          id="focus"
          {...register("focus")}
          rows={3}
          className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          placeholder="長期的な記憶レイヤー戦略を定義し、Atlas 全体のビジョンとガバナンスをリードします。"
        />
        {errors.focus && <p className="mt-1 text-sm text-red-600">{errors.focus.message}</p>}
      </div>

      <div>
        <label htmlFor="imageSrc" className="mb-2 block text-sm font-medium text-neutral-700">
          画像URL <span className="text-red-500">*</span>
        </label>
        <input
          id="imageSrc"
          {...register("imageSrc")}
          onChange={(e) => {
            setValue("imageSrc", e.target.value);
            setImagePreview(e.target.value);
          }}
          className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          placeholder="/favicon.svg"
        />
        {errors.imageSrc && (
          <p className="mt-1 text-sm text-red-600">{errors.imageSrc.message}</p>
        )}
        {imagePreview && (
          <div className="mt-4">
            <p className="mb-2 text-sm text-neutral-600">プレビュー:</p>
            <div className="relative h-32 w-32 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                sizes="128px"
                className="object-cover"
                onError={() => setImagePreview(null)}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="imageAlt" className="mb-2 block text-sm font-medium text-neutral-700">
          画像の説明
        </label>
        <input
          id="imageAlt"
          {...register("imageAlt")}
          className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          placeholder="Yuki Miyazaki"
        />
        {errors.imageAlt && <p className="mt-1 text-sm text-red-600">{errors.imageAlt.message}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="positionRow" className="mb-2 block text-sm font-medium text-neutral-700">
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
            <p className="mt-1 text-sm text-red-600">{errors.positionRow.message}</p>
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
            <p className="mt-1 text-sm text-red-600">{errors.positionColumn.message}</p>
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
            <p className="mt-1 text-sm text-red-600">{errors.positionOffsetY.message}</p>
          )}
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
  );
}

