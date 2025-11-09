"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";

const supporterGroupSchema = z.object({
  category: z.string().min(1, "カテゴリーは必須です"),
  supporters: z.array(z.string().min(1, "サポーター名を入力してください")).min(1),
});

type SupporterGroupFormData = z.infer<typeof supporterGroupSchema>;

type SupporterFormProps = {
  initialData?: {
    id: number;
    category: string;
    supporters: string[];
  };
};

export function SupporterForm({ initialData }: SupporterFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SupporterGroupFormData>({
    resolver: zodResolver(supporterGroupSchema),
    defaultValues: initialData
      ? {
          category: initialData.category,
          supporters: initialData.supporters,
        }
      : {
          supporters: [""],
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

  const onSubmit = async (data: SupporterGroupFormData) => {
    setLoading(true);
    setError(null);

    try {
      const adminSupabase = getAdminSupabaseClient();
      const supporterGroupData = {
        category: data.category,
        supporters: data.supporters,
      };

      if (initialData) {
        // 更新
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
        // 新規作成
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
        <label htmlFor="category" className="mb-2 block text-sm font-medium text-neutral-700">
          カテゴリー <span className="text-red-500">*</span>
        </label>
        <input
          id="category"
          {...register("category")}
          className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          placeholder="リードサポーター"
        />
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-neutral-700">
            サポーター <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => appendSupporter("")}
            className="text-sm text-neutral-600 underline"
          >
            + 追加
          </button>
        </div>
        {supporterFields.map((field, index) => (
          <div key={field.id} className="mb-2 flex gap-2">
            <input
              {...register(`supporters.${index}` as const)}
              className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
              placeholder="North Star Ventures"
            />
            {supporterFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeSupporter(index)}
                className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700 transition hover:bg-red-50"
              >
                削除
              </button>
            )}
          </div>
        ))}
        {errors.supporters && (
          <p className="mt-1 text-sm text-red-600">{errors.supporters.message}</p>
        )}
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

