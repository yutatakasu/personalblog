"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type FieldValues, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";

const positionSchema = z.object({
  id: z.string().min(1, "IDは必須です"),
  title: z.string().min(1, "タイトルは必須です"),
  department: z.string().min(1, "部署は必須です"),
  location: z.string().min(1, "勤務地は必須です"),
  workStyle: z.enum(["Onsite", "Hybrid", "Remote"], {
    message: "勤務形態を選択してください",
  }),
  teaser: z.string().min(1, "ティーザーは必須です"),
  summary: z.string().min(1, "概要は必須です"),
  responsibilities: z
    .array(z.string().min(1, "職務内容を入力してください"))
    .min(1),
  requirements: z.array(z.string().min(1, "必須要件を入力してください")).min(1),
  applyEmail: z
    .string()
    .email("有効なメールアドレスを入力してください")
    .optional()
    .or(z.literal("")),
});

type PositionFormData = z.infer<typeof positionSchema>;
type PositionFormFieldValues = PositionFormData & FieldValues;

type PositionFormProps = {
  initialData?: {
    id: string;
    title: string;
    department: string;
    location: string;
    work_style: string;
    teaser: string;
    summary: string;
    responsibilities: string[];
    requirements: string[];
    apply_email?: string;
  };
};

export function PositionForm({ initialData }: PositionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PositionFormFieldValues>({
    resolver: zodResolver(positionSchema),
    defaultValues: initialData
      ? {
          id: initialData.id,
          title: initialData.title,
          department: initialData.department,
          location: initialData.location,
          workStyle: initialData.work_style as "Onsite" | "Hybrid" | "Remote",
          teaser: initialData.teaser,
          summary: initialData.summary,
          responsibilities: initialData.responsibilities,
          requirements: initialData.requirements,
          applyEmail: initialData.apply_email || "",
        }
      : {
          responsibilities: [""],
          requirements: [""],
          applyEmail: "",
        },
  });

  const {
    fields: responsibilityFields,
    append: appendResponsibility,
    remove: removeResponsibility,
  } = useFieldArray<PositionFormFieldValues, "responsibilities">({
    control,
    name: "responsibilities",
  });

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray<PositionFormFieldValues, "requirements">({
    control,
    name: "requirements",
  });

  const onSubmit = async (data: PositionFormFieldValues) => {
    setLoading(true);
    setError(null);

    try {
      const adminSupabase = getAdminSupabaseClient();
      const positionData = {
        id: data.id,
        title: data.title,
        department: data.department,
        location: data.location,
        work_style: data.workStyle,
        teaser: data.teaser,
        summary: data.summary,
        responsibilities: data.responsibilities,
        requirements: data.requirements,
        apply_email: data.applyEmail || null,
      };

      if (initialData) {
        // 更新
        const { error: updateError } = await adminSupabase
          .from("positions")
          .update(positionData)
          .eq("id", data.id);

        if (updateError) {
          setError(updateError.message);
          setLoading(false);
          return;
        }
      } else {
        // 新規作成
        const { error: insertError } = await adminSupabase
          .from("positions")
          .insert(positionData);

        if (insertError) {
          setError(insertError.message);
          setLoading(false);
          return;
        }
      }

      router.push("/admin/positions");
      router.refresh();
    } catch (_err) {
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
          placeholder="ai-systems-engineer"
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
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            {...register("title")}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            placeholder="AI Systems Engineer"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="department"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            部署 <span className="text-red-500">*</span>
          </label>
          <input
            id="department"
            {...register("department")}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            placeholder="Atlas Core"
          />
          {errors.department && (
            <p className="mt-1 text-sm text-red-600">
              {errors.department.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="location"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            勤務地 <span className="text-red-500">*</span>
          </label>
          <input
            id="location"
            {...register("location")}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            placeholder="Tokyo / Remote"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">
              {errors.location.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="workStyle"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            勤務形態 <span className="text-red-500">*</span>
          </label>
          <select
            id="workStyle"
            {...register("workStyle")}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          >
            <option value="">選択してください</option>
            <option value="Onsite">Onsite</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
          </select>
          {errors.workStyle && (
            <p className="mt-1 text-sm text-red-600">
              {errors.workStyle.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="teaser"
          className="mb-2 block text-sm font-medium text-neutral-700"
        >
          ティーザー <span className="text-red-500">*</span>
        </label>
        <input
          id="teaser"
          {...register("teaser")}
          className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          placeholder="メモリと推論を結ぶ心臓部を、ともに磨き上げる仲間を探しています。"
        />
        {errors.teaser && (
          <p className="mt-1 text-sm text-red-600">{errors.teaser.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="summary"
          className="mb-2 block text-sm font-medium text-neutral-700"
        >
          概要 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="summary"
          {...register("summary")}
          rows={4}
          className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          placeholder="長期記憶レイヤーと推論エンジンの連携を最適化し、Atlas の知覚・応答品質を継続的に高めます。"
        />
        {errors.summary && (
          <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-700">
            職務内容 <span className="text-red-500">*</span>
          </span>
          <button
            type="button"
            onClick={() => appendResponsibility("")}
            className="text-sm text-neutral-600 underline"
          >
            + 追加
          </button>
        </div>
        {responsibilityFields.map((field, index) => (
          <div key={field.id} className="mb-2 flex gap-2">
            <input
              {...register(`responsibilities.${index}` as const)}
              className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
              placeholder="分散メモリ基盤と推論パイプラインの技術課題を特定・解決する"
            />
            {responsibilityFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeResponsibility(index)}
                className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700 transition hover:bg-red-50"
              >
                削除
              </button>
            )}
          </div>
        ))}
        {errors.responsibilities && (
          <p className="mt-1 text-sm text-red-600">
            {errors.responsibilities.message}
          </p>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-700">
            必須要件 <span className="text-red-500">*</span>
          </span>
          <button
            type="button"
            onClick={() => appendRequirement("")}
            className="text-sm text-neutral-600 underline"
          >
            + 追加
          </button>
        </div>
        {requirementFields.map((field, index) => (
          <div key={field.id} className="mb-2 flex gap-2">
            <input
              {...register(`requirements.${index}` as const)}
              className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
              placeholder="Python / TypeScript いずれかのプロダクション経験"
            />
            {requirementFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeRequirement(index)}
                className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700 transition hover:bg-red-50"
              >
                削除
              </button>
            )}
          </div>
        ))}
        {errors.requirements && (
          <p className="mt-1 text-sm text-red-600">
            {errors.requirements.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="applyEmail"
          className="mb-2 block text-sm font-medium text-neutral-700"
        >
          応募メールアドレス
        </label>
        <input
          id="applyEmail"
          type="email"
          {...register("applyEmail")}
          className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          placeholder="info@atlas-official.net"
        />
        {errors.applyEmail && (
          <p className="mt-1 text-sm text-red-600">
            {errors.applyEmail.message}
          </p>
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
