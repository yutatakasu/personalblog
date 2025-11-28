import type { Metadata } from "next";

import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "サービスプライバシーポリシー | Atlas, Inc",
  description:
    "Atlas株式会社が提供するサービスにおける個人情報の取り扱いについて説明しています。",
};

export default function ServicePrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto flex w-full max-w-3xl flex-col px-6 pb-24 pt-28 sm:px-10 sm:pt-36">
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: "Atlas", href: "/" },
              { label: "Service Privacy Policy", current: true },
            ]}
            className="mb-0"
          />
        </div>

        <article className="space-y-12">
          <header className="space-y-4">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-[2.75rem]">
              サービスプライバシーポリシー
            </h1>
          </header>

          <section className="space-y-4">
            <p className="text-sm leading-relaxed text-black/70 sm:text-base">
              Atlas株式会社（以下「当社」といいます）は、当社ウェブサイト上で展開するサービス（以下「本サービス」といいます）をご利用いただく皆様の個人情報の取り扱いについて、以下に定める方針を策定しました。本ポリシーは、サービス利用に際して当社がどのように情報を収集・利用し、管理するかを明確にするものです。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-black sm:text-2xl">
              第1条（個人情報の定義）
            </h2>
            <p className="text-sm leading-relaxed text-black/70 sm:text-base">
              本ポリシーにおける「個人情報」とは、個人情報保護法に基づく定義に従い、生存する個人に関する各種情報を指します。具体的には、氏名、誕生日、住所、電話番号、連絡先など、記述により特定の個人が識別可能な情報、および顔写真、指紋、声紋、また健康保険証記載の保険者番号など、単独で個人の特定ができるデータが含まれます。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-black sm:text-2xl">
              第2条（情報収集の方法）
            </h2>
            <p className="text-sm leading-relaxed text-black/70 sm:text-base">
              当社は、本サービスの提供にあたり、ユーザーの端末やアクセス状況に関する情報を自動的に取得することがあります。これには、アクセス日時、閲覧ページ、画面の操作情報、使用デバイスに関する情報等が含まれます。
            </p>
            <p className="text-sm leading-relaxed text-black/70 sm:text-base">
              これらの情報は、ユーザーのサービス利用状況を把握し、サービスの品質向上および利便性向上を目的として収集されます。また、情報の取得は、当社が提供するスクリプトの実装を通じて行われ、取得された情報は安全な方法により当社サーバーへ送信されます。
            </p>
            <p className="text-sm leading-relaxed text-black/70 sm:text-base">
              なお、当社は、取得情報のうちIPアドレス等の識別可能性がある情報については、匿名化処理を行い、特定の個人を識別できない形でのみ利用しております。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-black sm:text-2xl">
              第3条（個人情報の収集および利用目的）
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-black/70 sm:text-base">
              当社がユーザーの個人情報を収集・利用する理由は、以下の目的を達成するためです。
            </p>
            <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-black/70 sm:text-base">
              <li className="pl-1">
                本サービスにおけるECエージェント機能の最適化および改善のため
              </li>
              <li className="pl-1">
                行動分析モデルの学習データとして活用し、ユーザー体験の向上およびパーソナライズを図るため
              </li>
              <li className="pl-1">
                アクセス傾向の分析により、サービスの運用改善・不具合検出を行うため
              </li>
              <li className="pl-1">
                本サービスの品質向上および技術的改善、パフォーマンス向上のための統計分析の実施
              </li>
            </ol>
            <p className="mt-4 text-sm leading-relaxed text-black/70 sm:text-base">
              なお、収集する情報は個人情報および個人関連情報には該当せず、ユーザー識別は匿名化されたハッシュ情報によって行われます。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-black sm:text-2xl">
              第4条（利用目的の変更）
            </h2>
            <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-black/70 sm:text-base">
              <li className="pl-1">
                当社は、現行の利用目的と合理的な関連性が認められる場合に限り、個人情報の利用目的を変更することができます。
              </li>
              <li className="pl-1">
                変更が行われた際は、所定の方法にてユーザーにお知らせするか、もしくは当社ウェブサイト上に速やかに公示いたします。
              </li>
            </ol>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-black sm:text-2xl">
              第5条（個人情報の第三者への提供）
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-black/70 sm:text-base">
              当社は、以下の特定の場合を除き、事前にユーザーの同意なく個人情報を第三者へ提供することはいたしません。ただし、個人情報保護法等の法令に基づく場合はこの限りではありません。
            </p>
            <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-black/70 sm:text-base">
              <li className="pl-1">
                人命、身体、または財産保護のため、かつ同意取得が困難な場合
              </li>
              <li className="pl-1">
                公衆衛生の向上や児童の健全な育成に特に必要で、同意が得にくい場合
              </li>
              <li className="pl-1">
                国や地方公共団体、その委託先が法令に定める業務を遂行するために協力が求められる場合（同意が業務の支障となる場合）
              </li>
              <li className="pl-1">
                予め以下の事項を通知または公示し、かつ個人情報保護委員会への届出がなされている場合
                <ul className="mt-2 space-y-2 pl-4">
                  <li className="relative pl-4">
                    <span className="absolute left-0 top-2 h-1 w-1 rounded-full bg-black/30" />
                    利用目的に第三者への提供を含むこと
                  </li>
                  <li className="relative pl-4">
                    <span className="absolute left-0 top-2 h-1 w-1 rounded-full bg-black/30" />
                    提供される情報の項目
                  </li>
                  <li className="relative pl-4">
                    <span className="absolute left-0 top-2 h-1 w-1 rounded-full bg-black/30" />
                    第三者への提供方法
                  </li>
                  <li className="relative pl-4">
                    <span className="absolute left-0 top-2 h-1 w-1 rounded-full bg-black/30" />
                    本人の要求により提供停止が可能なこと
                  </li>
                  <li className="relative pl-4">
                    <span className="absolute left-0 top-2 h-1 w-1 rounded-full bg-black/30" />
                    問い合わせ方法について
                  </li>
                </ul>
              </li>
            </ol>
            <p className="mt-6 mb-4 text-sm leading-relaxed text-black/70 sm:text-base">
              また、以下の場合においては、情報提供先は第三者とみなされません。
            </p>
            <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-black/70 sm:text-base">
              <li className="pl-1">
                本サービスの目的達成に必要な範囲内で個人情報の一部または全部を委託する場合
              </li>
              <li className="pl-1">
                合併や事業承継により、個人情報が移転される場合
              </li>
              <li className="pl-1">
                特定の者との間で共同利用する場合で、その旨および共同利用する情報の内容、利用目的、共同利用者の範囲、管理責任者の情報が事前に通知される、または容易に確認できる状態にある場合
              </li>
            </ol>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-black sm:text-2xl">
              第6条（個人情報の開示）
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-black/70 sm:text-base">
              当社は、ユーザーから個人情報の開示請求を受けた際、速やかに対応いたします。ただし、以下に該当する場合は、全部または一部の情報開示を差し控えることがあり、その旨を速やかにご連絡いたします。なお、1件あたり1,000円の手数料を申し受けます。
            </p>
            <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-black/70 sm:text-base">
              <li className="pl-1">
                本人または第三者の生命、身体、財産その他の権利が損なわれる恐れがある場合
              </li>
              <li className="pl-1">当社の業務運営に著しい支障をきたす場合</li>
              <li className="pl-1">その他法令に反する場合</li>
            </ol>
            <p className="mt-4 text-sm leading-relaxed text-black/70 sm:text-base">
              履歴や特性といった個人情報以外の情報については、原則として開示いたしません。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-black sm:text-2xl">
              第7条（情報の修正および削除）
            </h2>
            <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-black/70 sm:text-base">
              <li className="pl-1">
                ユーザーは、当社が保有する自己の情報に誤りが認められる場合、定められた手続きに基づいて、情報の修正、追加または削除（以下「修正等」といいます）を求めることができます。
              </li>
              <li className="pl-1">
                当社は、修正等の請求内容が正当であると判断した場合、速やかに対応いたします。
              </li>
              <li className="pl-1">
                修正等の実施または不実施の決定については、決定後速やかにユーザーへご通知いたします。
              </li>
            </ol>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-black sm:text-2xl">
              第8条（利用停止および削除の措置）
            </h2>
            <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-black/70 sm:text-base">
              <li className="pl-1">
                本人より、個人情報が当初の利用目的を超えて使用されている、もしくは不正な手段で取得されたとの申し出があった場合、当社は速やかに必要な調査を行います。
              </li>
              <li className="pl-1">
                調査の結果、利用停止または削除が必要と判断された場合は、迅速に対応いたします。
              </li>
              <li className="pl-1">
                利用停止等の措置を講じた場合、または講じないと判断した場合は、その決定内容を速やかにユーザーにご連絡いたします。
              </li>
              <li className="pl-1">
                利用停止等の措置に過大な費用がかかる、または実施が困難な場合には、ユーザーの権利を守るための代替措置を講じることとします。
              </li>
            </ol>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-black sm:text-2xl">
              第9条（プライバシーポリシーの改定）
            </h2>
            <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-black/70 sm:text-base">
              <li className="pl-1">
                本ポリシーの内容は、法令やその他別途定める事項に反しない限り、事前の通知なしに改定されることがあります。
              </li>
              <li className="pl-1">
                改定後のポリシーは、当社ウェブサイト上に掲載された時点で効力を生じます。
              </li>
            </ol>
          </section>
        </article>
      </main>
    </div>
  );
}
