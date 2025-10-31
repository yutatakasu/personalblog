# AI エージェント向けガイドライン

始めに、ユーザーとのやり取りは日本語をしようしてください。

このドキュメントは、AI エージェント（Cursor など）がこのプロジェクトで作業する際に従うべきルールとガイドラインをまとめたものです。

---

## 目次

1. [実装ルール](#実装ルール)
   - [セッション開始時の必須参照](#セッション開始時の必須参照)
   - [ドキュメント参照の原則](#ドキュメント参照の原則)
   - [実装時の基本フロー](#実装時の基本フロー)
   - [ドキュメント更新のルール](#ドキュメント更新のルール)
   - [実装の優先順位](#実装の優先順位)
2. [Clean Code コーディング規約](#clean-code-コーディング規約)
3. [MCP 使用ガイドライン](#mcp-使用ガイドライン)

---

# 実装ルール

## セッション開始時の必須参照

Cursor でセッションを立ち上げたら、**必ず最初に `docs/prd.md` を参照してください**。

### 参照方法

1. セッション開始時、または新しい実装タスクを開始する前に、`docs/prd.md` の内容を確認する
2. プロダクト要件、デザイン要件、技術要件を理解してから実装を開始する
3. 実装中に不明な点があれば、`docs/prd.md` を再確認する

### 参照すべき内容

- プロダクト概要と目的
- デザイン要件（カラーパレット、タイポグラフィ、レイアウト）
- 機能要件（各セクションの仕様）
- レスポンシブデザイン要件
- 技術要件（使用する技術スタック）
- 優先順位（Phase 1〜3）

### 注意事項

- `prd.md` に記載されていない要件を実装する前に、必ず確認を取る
- `prd.md` と実装内容に矛盾がある場合は、実装を修正するか、`prd.md` を更新する

---

## ドキュメント参照の原則

実装を行う際は、**必ず以下のドキュメントを参照**してください。

### 1. プロダクト要件定義書（PRD）

**ファイル**: `docs/prd.md`

**参照すべき内容:**

- プロジェクトの目的とゴール
- 主要機能の仕様（MVP vs 将来的な拡張機能）
- リリース計画（Phase 0〜4）
- 技術的制約
- 成功指標

**参照タイミング:**

- 新機能を実装する前
- 機能の優先順位を判断するとき
- MVP の範囲を確認するとき
- 実装方針に迷ったとき

### 2. アーキテクチャ概要

**ファイル**: `docs/architecture.md`

**参照すべき内容:**

- システム全体の構成図
- 主要コンポーネントの役割
- チャットフロー（SSE）の仕組み
- 認証フローの設計
- デプロイ/ランタイム構成

**参照タイミング:**

- システムの全体像を把握したいとき
- コンポーネント間の連携を実装するとき
- データフローを確認するとき
- アーキテクチャ変更を検討するとき

### 3. 詳細設計

**ファイル**: `docs/design.md`

**参照すべき内容:**

- データベース設計（テーブル定義、ER 図、インデックス設計）
- データモデルの詳細
- コンポーネント間のインターフェース設計
- 状態管理の設計
- UI/UX の詳細仕様
- より細かい粒度での設計情報

**参照タイミング:**

- データベーステーブルを作成/変更するとき
- データモデルを扱うとき
- コンポーネント間の連携を実装するとき
- UI コンポーネントの詳細を確認したいとき
- 設計の詳細を確認したいとき

### 4. 技術仕様書

**ファイル**: `docs/tech.md`

**参照すべき内容:**

- 技術スタックの詳細
- フロントエンド/バックエンドの構成
- RLS ポリシー
- API 仕様（エンドポイント、リクエスト/レスポンス形式）
- 環境変数の設定
- エラーハンドリング方針

**参照タイミング:**

- 具体的な実装を始める前
- 使用する技術やライブラリを確認するとき
- API を実装/呼び出すとき
- 環境変数を設定するとき

---

## 実装時の基本フロー

1. **要件確認**: `docs/prd.md` で機能要件を確認
2. **アーキテクチャ確認**: `docs/architecture.md` でシステム全体構成を理解
3. **詳細設計確認**: `docs/design.md` でデータベース設計やコンポーネント設計を確認
4. **技術仕様確認**: `docs/tech.md` で実装の詳細を確認
5. **実装**: コーディング規約に従って実装
6. **動作確認**: 要件を満たしているか検証

---

## ドキュメント更新のルール

実装中に以下の変更があった場合は、**該当するドキュメントも更新**してください：

- **新機能の追加**: `docs/prd.md` に追加
- **アーキテクチャ変更**: `docs/architecture.md` を更新
- **データベーススキーマ変更**: `docs/design.md` のテーブル定義を更新
- **データモデル変更**: `docs/design.md` のデータモデルを更新
- **コンポーネント設計変更**: `docs/design.md` のコンポーネント設計を更新
- **API 変更**: `docs/tech.md` の API 仕様を更新
- **環境変数の追加/変更**: `docs/tech.md` の環境変数セクションを更新

---

## 実装の優先順位

`docs/prd.md` のリリース計画に従って実装してください：

1. **Phase 0**: 認証 + 最小チャット（最優先）
2. **Phase 1**: MVP 開発
3. **Phase 2**: データ永続化
4. **Phase 3**: UX 改善
5. **Phase 4**: 拡張機能

MVP（必須機能）を優先し、Nice to Have（将来的な拡張機能）は後回しにしてください。

---

## 注意事項

- **ドキュメントとコードの整合性を保つ**: 実装がドキュメントと矛盾する場合は、どちらかを修正
- **不明点があれば確認**: ドキュメントに記載がない場合や曖昧な場合は、ユーザーに確認
- **技術的制約を守る**: 個人開発のため、コストは最小限に、シンプルさを優先
- **セキュリティを意識**: 認証・認可、RLS、環境変数の管理を徹底

---

## 参考資料

実装時に参考にすべき公式ドキュメント：

- **Next.js**: https://nextjs.org/docs
- **Vercel AI SDK**: https://sdk.vercel.ai/docs
- **OpenAI Agent SDK**: https://platform.openai.com/docs/guides/agent
- **Supabase**: https://supabase.com/docs
- **Shadcn/ui**: https://ui.shadcn.com/
- **ChatKit**: https://chatkit.ai/
- **Tailwind CSS**: https://tailwindcss.com/docs

---

# Clean Code コーディング規約

このプロジェクトでは、Clean Code の原則に従ったコーディングスタイルを守ります。

## 1. 命名規則

### 意図を明確にする命名

- **変数名・関数名は目的を明確に表現する**
  - ❌ `d` （経過日数）
  - ✅ `elapsedDays` または `daysSinceCreation`
- **省略形を避け、検索可能な名前を使う**
  - ❌ `usr`, `acc`, `tmp`
  - ✅ `user`, `account`, `temporaryStorage`
- **クラス名は名詞、関数名は動詞で始める**
  - クラス: `User`, `OrderProcessor`, `EmailValidator`
  - 関数: `getUserById`, `processOrder`, `validateEmail`

### 命名の一貫性

- **boolean 値は is/has/can などの接頭辞を使う**
  - `isActive`, `hasPermission`, `canEdit`
- **配列やリストは複数形を使う**
  - `users`, `orders`, `items`
- **定数は UPPER_SNAKE_CASE を使う**
  - `MAX_RETRY_COUNT`, `API_BASE_URL`

## 2. 関数（メソッド）の原則

### 小さく保つ

- **1 つの関数は 1 つのことだけを行う（単一責任の原則）**
- **関数の長さは 20 行以内を目指す**
- **引数は 3 個以下に抑える**（それ以上ならオブジェクトにまとめる）

### 副作用を避ける

- **関数の名前から予想される以上のことをしない**
- **可能な限り純粋関数を目指す**

```typescript
// ❌ Bad: 関数名から予想できない副作用がある
function checkPassword(password: string): boolean {
  if (isValid(password)) {
    Session.initialize(); // 副作用！
    return true;
  }
  return false;
}

// ✅ Good: 単一責任で副作用なし
function isValidPassword(password: string): boolean {
  return password.length >= 8 && /[A-Z]/.test(password);
}
```

## 3. コメント

### コードで表現できることはコメントで書かない

- **コードを書き直すことでコメントを不要にする**

```typescript
// ❌ Bad: コメントで説明
// ユーザーがアクティブで権限を持っているかチェック
if (user.status === "active" && user.role === "admin") {
  ...;
}

// ✅ Good: 関数名で説明
if (isActiveAdmin(user)) {
  ...;
}
```

### 必要なコメントのみ書く

- **なぜそうしたのか（Why）を説明する**（何をしているか（What）ではない）
- **法的コメント、警告、TODO コメントは OK**
- **公開 API のドキュメントコメントは必須**

## 4. フォーマットとスタイル

### 一貫性のあるフォーマット

- **垂直方向の整理**: 関連するコードは近くに、異なる概念は空行で区切る
- **水平方向の整理**: インデントを適切に使用し、行の長さは 80〜120 文字以内
- **1 つのファイルは 1 つの責任を持つクラス/モジュール**

### インポート文の整理

```typescript
// 1. 外部ライブラリ
import React from "react";
import { useQuery } from "@tanstack/react-query";

// 2. 内部の共通モジュール
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

// 3. 相対パスのインポート
import { UserProfile } from "./UserProfile";
```

## 5. エラーハンドリング

### エラーを隠さない

- **try-catch は具体的な例外処理を行う場所でのみ使う**
- **エラーメッセージは意味のある情報を含める**
- **null を返すのではなく、例外を投げるか Optional を使う**

```typescript
// ❌ Bad: エラーを無視
try {
  riskyOperation();
} catch (e) {
  // 何もしない
}

// ✅ Good: 適切なエラーハンドリング
try {
  riskyOperation();
} catch (error) {
  logger.error("Failed to execute risky operation", { error });
  throw new OperationError("Operation failed", { cause: error });
}
```

## 6. DRY 原則（Don't Repeat Yourself）

- **同じコードを 3 回書いたら抽象化を検討する**
- **ただし、過度な抽象化は避ける**（重複と抽象化のバランスを取る）

## 7. クラスの原則

### 単一責任の原則（SRP）

- **クラスは 1 つの責任のみを持つ**
- **クラスを変更する理由は 1 つだけであるべき**

### 小さく保つ

- **クラスの行数は 200〜500 行以内を目指す**
- **public メソッドの数は 10 個以内を目指す**

## 8. データ構造とオブジェクト

### データ構造 vs オブジェクト

- **データ構造**: データを公開し、振る舞いを持たない
- **オブジェクト**: データを隠蔽し、振る舞いを公開する

### 適切に使い分ける

```typescript
// データ構造（TypeScript の型）
type Point = {
  x: number;
  y: number;
};

// オブジェクト（クラス）
class Circle {
  private radius: number;

  constructor(radius: number) {
    this.radius = radius;
  }

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }
}
```

## 9. React/Next.js 固有のルール

### コンポーネント設計

- **コンポーネントは小さく、再利用可能に**
- **Props は明示的に型定義する**
- **カスタムフックで状態ロジックを分離する**

```typescript
// ✅ Good: 小さくて単一責任
interface ButtonProps {
  onClick: () => void;
  label: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export function Button({
  onClick,
  label,
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} className={`btn-${variant}`}>
      {label}
    </button>
  );
}
```

### ファイル構造

- **1 ファイル 1 コンポーネント**（例外: 小さなヘルパーコンポーネント）
- **コンポーネント名とファイル名を一致させる**

## 10. TypeScript 固有のルール

### 型の活用

- **any は原則使用禁止**（どうしても必要な場合は unknown を検討）
- **型推論を活用するが、public API は明示的に型定義する**
- **Union Types や Type Guards を活用する**

```typescript
// ✅ Good: 明示的な型定義
function processUser(user: User): ProcessedUser {
  // ...
}

// ✅ Good: Type Guard の活用
function isError(response: ApiResponse): response is ErrorResponse {
  return "error" in response;
}
```

## 11. Python 固有のルール

### PEP 8 スタイルガイドに従う

- **インデントは 4 スペース**を使用
- **行の長さは 79 文字以内**（docstring やコメントは 72 文字以内）
- **関数・変数は snake_case、クラスは PascalCase、定数は UPPER_SNAKE_CASE**

```python
# ✅ Good: PEP 8 に準拠
class UserProfile:
    MAX_USERNAME_LENGTH = 50

    def __init__(self, user_id: int, username: str):
        self.user_id = user_id
        self.username = username

    def get_display_name(self) -> str:
        return f"@{self.username}"
```

### 型ヒントの活用

- **関数の引数と戻り値には型ヒントを必ず付ける**
- **typing モジュールを活用する**（Optional, Union, List, Dict など）
- **Python 3.10+ では新しい型構文を優先**（list[str], dict[str, int] など）

```python
from typing import Optional

# ✅ Good: 明示的な型ヒント
def find_user_by_id(user_id: int) -> Optional[dict[str, Any]]:
    """IDでユーザーを検索する"""
    user = db.query(User).filter_by(id=user_id).first()
    return user.to_dict() if user else None

# ✅ Good: Python 3.10+ の型構文
def process_items(items: list[str], config: dict[str, int]) -> list[int]:
    return [config.get(item, 0) for item in items]
```

### Docstring の記述

- **すべての public 関数・クラスには docstring を書く**
- **Google スタイルまたは NumPy スタイルを使用**
- **引数、戻り値、例外を明記する**

```python
def calculate_discount(
    price: float,
    discount_rate: float,
    max_discount: float = 100.0
) -> float:
    """
    割引額を計算する。

    Args:
        price: 商品の元の価格
        discount_rate: 割引率（0.0〜1.0）
        max_discount: 最大割引額（デフォルト: 100.0）

    Returns:
        割引後の価格

    Raises:
        ValueError: discount_rate が 0.0〜1.0 の範囲外の場合
    """
    if not 0.0 <= discount_rate <= 1.0:
        raise ValueError("discount_rate must be between 0.0 and 1.0")

    discount = min(price * discount_rate, max_discount)
    return price - discount
```

### Pythonic なコードを書く

- **リスト内包表記を活用する**（ただし読みやすさを優先）
- **コンテキストマネージャ（with 文）を使う**
- **enumerate や zip を適切に使う**

```python
# ✅ Good: Pythonic
active_users = [user for user in users if user.is_active]

# ✅ Good: コンテキストマネージャ
with open("data.txt", "r") as f:
    data = f.read()

# ✅ Good: enumerate の使用
for index, item in enumerate(items):
    print(f"{index}: {item}")

# ❌ Bad: 非 Pythonic
active_users = []
for user in users:
    if user.is_active:
        active_users.append(user)
```

### 例外処理

- **具体的な例外をキャッチする**（bare except は避ける）
- **カスタム例外クラスを定義する**
- **例外チェイニングを活用する**

```python
# ✅ Good: 具体的な例外処理
try:
    result = api.fetch_data(endpoint)
except requests.ConnectionError as e:
    logger.error(f"Connection failed: {e}")
    raise APIConnectionError("Failed to connect to API") from e
except requests.Timeout as e:
    logger.error(f"Request timed out: {e}")
    raise APITimeoutError("API request timed out") from e

# ❌ Bad: bare except
try:
    result = api.fetch_data(endpoint)
except:
    pass
```

### データクラスの活用

- **単純なデータ保持にはデータクラスを使う**
- **frozen=True で不変オブジェクトを作る**
- **型ヒントと組み合わせる**

```python
from dataclasses import dataclass
from datetime import datetime

# ✅ Good: データクラスの活用
@dataclass(frozen=True)
class User:
    id: int
    username: str
    email: str
    created_at: datetime
    is_active: bool = True

user = User(
    id=1,
    username="john_doe",
    email="john@example.com",
    created_at=datetime.now()
)
```

### import 文の整理

- **標準ライブラリ、サードパーティ、ローカルの順に整理**
- **各グループ内はアルファベット順**
- **from import は絶対パスを優先**

```python
# 1. 標準ライブラリ
import os
import sys
from datetime import datetime
from typing import Optional

# 2. サードパーティライブラリ
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException

# 3. ローカルモジュール
from app.models import User
from app.services.auth import authenticate_user
```

### 関数のデフォルト引数

- **ミュータブルなデフォルト引数は使わない**
- **None を使ってガード句で初期化する**

```python
# ❌ Bad: ミュータブルなデフォルト引数
def add_item(item: str, items: list[str] = []) -> list[str]:
    items.append(item)
    return items

# ✅ Good: None を使って初期化
def add_item(item: str, items: list[str] | None = None) -> list[str]:
    if items is None:
        items = []
    items.append(item)
    return items
```

### ジェネレータの活用

- **大きなデータセットにはジェネレータを使う**
- **メモリ効率を意識する**

```python
# ✅ Good: ジェネレータを使用
def read_large_file(file_path: str) -> Iterator[str]:
    """大きなファイルを行ごとに読み込む"""
    with open(file_path, "r") as f:
        for line in f:
            yield line.strip()

# 使用例
for line in read_large_file("huge_file.txt"):
    process_line(line)
```

## まとめ

- **コードは読まれることを前提に書く**
- **シンプルさを追求する**（KISS: Keep It Simple, Stupid）
- **早すぎる最適化を避ける**
- **リファクタリングを恐れない**
- **コードレビューで互いに学ぶ**

これらのルールは絶対的なものではなく、チームで議論し、プロジェクトに合わせて調整していくものです。

---

# MCP 使用ガイドライン

このプロジェクトでは、以下の MCP サーバーを利用できます。適切なタイミングで活用してください。

## 利用可能な MCP サーバー

### 1. Serena（コードベース解析・リファクタリング）

**主な機能:**

- シンボル検索（クラス、関数、メソッドなど）
- コード参照の検索
- シンボルのリネーム
- コードの挿入・置換
- ファイル・ディレクトリの検索
- プロジェクトメモリの管理

**使用すべき場面:**

#### コードベースの理解

- プロジェクト構造を初めて把握するとき
- 特定のクラスや関数の定義を探すとき
- コードの依存関係を理解したいとき

```
使用例:
- "UserServiceクラスはどこで定義されていますか？"
- "authenticateメソッドがどこで使われているか教えてください"
- "プロジェクト全体の構造を把握したい"
```

#### リファクタリング

- クラス名、関数名、変数名を一括変更するとき
- コードの再構成が必要なとき
- プロジェクト全体に影響する変更を行うとき

```
使用例:
- "UserServiceをAuthServiceにリネームしてください"
- "getUserメソッド名をfetchUserに変更"
- "特定のメソッドをクラスに追加"
```

#### コード検索

- 特定のパターンやキーワードを含むコードを探すとき
- 正規表現を使った複雑な検索が必要なとき
- 複数ファイルにまたがる変更箇所を特定したいとき

```
使用例:
- "TODO コメントがあるファイルを全て見つけて"
- "非推奨のAPIを使っている箇所を探して"
- "エラーハンドリングが不十分な箇所を検索"
```

#### プロジェクトメモリ

- プロジェクト固有の重要な情報を保存・参照するとき
- アーキテクチャの決定事項を記録したいとき
- 将来のタスクで必要になる情報を保管するとき

```
使用例:
- "この認証フローの設計思想をメモリに保存"
- "プロジェクトのAPI設計ガイドラインを参照"
```

**使用を避けるべき場面:**

- 単純なファイル読み込み（read_file ツールを使用）
- 小規模な単一ファイルの編集（search_replace ツールを使用）
- ブラウザ操作が必要な場合（Playwright を使用）

---

## MCP 使用の一般的なガイドライン

### 優先順位の考え方

1. **まず標準ツールを検討**

   - `read_file`, `search_replace`, `grep`, `codebase_search` などの標準ツール
   - 標準ツールで対応できる場合は MCP を使う必要はない

2. **複雑な操作には MCP を活用**

   - シンボルの一括リネーム → Serena
   - プロジェクト全体のコード解析 → Serena

3. **効率性を重視**
   - 手動で行うと時間がかかる作業は積極的に MCP を使用
   - 自動化できる繰り返し作業は MCP で効率化

### 使用時の注意事項

- **目的を明確にする**: 何を達成したいのかを明確にしてから MCP を選択
- **適切なツールを選ぶ**: コード関連は Serena を使用
- **結果を確認する**: MCP の実行結果は必ず確認し、意図した通りか検証
- **エラーハンドリング**: MCP がエラーを返した場合は適切に対処

---

## 実践的な使用例

### シナリオ 1: 新機能の実装

```
1. Serena でプロジェクト構造を理解
2. Serena で関連するコードを検索
3. 標準ツールでコード実装
4. Serena でメモリに設計情報を保存
```

### シナリオ 2: バグ修正

```
1. Serena で問題のある関数を検索
2. Serena で関数の使用箇所を特定
3. 標準ツールでコード修正
```

### シナリオ 3: リファクタリング

```
1. Serena でリファクタリング対象を検索
2. Serena でシンボルをリネーム
3. Serena で参照箇所を確認
```

---

## まとめ

- **Serena**: コードベースの理解・検索・リファクタリングに特化
- **適材適所**: タスクに応じて最適な MCP を選択
- **標準ツールとの併用**: MCP と標準ツールを組み合わせて効率的に作業

MCP は強力なツールですが、使いすぎず、必要な時に適切に活用することが重要です。
