MagicTouch
===

MagicTouch は マウスでもタブレット端末でも同様な操作感のイベントを提供します。

使用方法
---

MagicTouch をインストールするコマンドを以下に記...
そうと思いましたが、`npm`に`publish`したら書きます。

### ライブラリ利用方法 ###


以下サンプル

```javascript
const elem = document.getElementById('target');
MagicTouch.enchantment(elem);
// 以下イベント
elem.addEventListener('hold', (ev) => {
    // 長押しされた
});
elem.addEventListener('flick', (ev) => {
    // マウスまたは指で弾かれた。
});
elem.addEventListener('holdmove', (ev) => {
    // 長押し後に移動した
});
elem.addEventListener('holdleave', (ev) => {
    // 長押しを解除した。
});
elem.addEventListener('holdover', (ev) => {
    // enchantmentを受けた他の要素で長押しを開始し、elem上にマウスを移動した。
});
elem.addEventListener('holdldrop', (ev) => {
    // enchantmentを受けた他の要素で長押しを開始し、elem上で長押しを解除した。
});
```

ドキュメント
---
利用方法は`enchantment`を呼び出すのみです。引数は以下の通り

- `element`: `HTMLElement` イベントを有効にするエレメント
- `opts`: `Object` オプション。この値は変更すればすでに反映済みの要素のしきい値も変化する。項目は以下
    - `holdThreshold`: `number` (既定: `750`) mousedownまたはtouchstartから長押しと判定するまでの期間。(ミリ秒)
    - `acceptableDistThreshold`: `number` (既定: `1.5`) 長押し(その場で押し続ける)際に許容するブレ。(マウスまたは指の加速度)
    - `flickThreshold`: `number` (既定: `1.5`) フリック操作と判定する際の加速度

### 各イベントオブジェクト ###
すべて`CustomEvent`にて実装しているので以下は`detail`内を示す。

- `hold`

| プロパティ | 型                         | 意味 |
| --------- | -------------------------- | ---- |
| `point`   | `{x: number, y: numnber}`  | タップまたはクリックの開始座標(`pageX/pageY`相当) |
| `rawEv`   | `MouseEvent \| TouchEvent` | `hold`イベントを発砲するきっかけとなった`mousedown`または`touchstart`イベントのイベントオブジェクト |

- `holdmove`

| プロパティ | 型                         | 意味 |
| --------- | -------------------------- | ---- |
| `point`   | `{x: number, y: numnber}`  | 移動後のタップまたはクリック座標(`pageX/pageY`相当) |
| `rawEv`   | `MouseEvent \| TouchEvent` | `hold`イベントを発砲するきっかけとなった`mousedown`または`touchstart`イベントのイベントオブジェクト |

- `holdover`

| プロパティ | 型                         | 意味 |
| --------- | -------------------------- | ---- |
| `point`   | `{x: number, y: numnber}`  | 移動後のタップまたはクリック座標(`pageX/pageY`相当) |
| `item`    | `HTMLElement`              | タップまたはクリックを開始した`HTMLElement` |
| `rawEv`   | `MouseEvent \| TouchEvent` | `hold`イベントを発砲するきっかけとなった`mousedown`または`touchstart`イベントのイベントオブジェクト |

- `holdleave`

| プロパティ | 型                         | 意味 |
| --------- | -------------------------- | ---- |
| `point`   | `{x: number, y: numnber}`  | タップまたはクリックが終了する直前の座標(`pageX/pageY`相当) |
| `rawEv`   | `MouseEvent \| TouchEvent` | `hold`イベントを発砲するきっかけとなった`mousedown`または`touchstart`イベントのイベントオブジェクト |

- `holddrop`

| プロパティ | 型                         | 意味 |
| --------- | -------------------------- | ---- |
| `point`   | `{x: number, y: numnber}`  | 移動後のタップまたはクリック座標(`pageX/pageY`相当) |
| `item`    | `HTMLElement`              | タップまたはクリックを開始した`HTMLElement` |
| `rawEv`   | `MouseEvent \| TouchEvent` | `hold`イベントを発砲するきっかけとなった`mousedown`または`touchstart`イベントのイベントオブジェクト |

- `flick`

| プロパティ | 型                         | 意味 |
| --------- | -------------------------- | ---- |
| `start`   | `{x: number, y: numnber}`  | タップまたはクリックの開始座標(`pageX/pageY`相当) |
| `point`   | `{x: number, y: numnber}`  | タップまたはクリックが終了する直前の座標(`pageX/pageY`相当) |
| `angle`   | `number`                   | フリックで指を弾いたときの角度(rad) |
| `speed`   | `number`                   | フリックで指を弾いたときの加速度 |
| `rawEv`   | `MouseEvent \| TouchEvent` | `hold`イベントを発砲するきっかけとなった`mousedown`または`touchstart`イベントのイベントオブジェクト |
