"use client";

import { Field, Icon, Input, Label, Tag } from "tamga-ui";
import { Info } from "tamga-ui/icons";

/**
 * Alan etiketinin beş türü · tasarımın 02.02'si.
 *
 * İstemci dosyası, çünkü glif bir BİLEŞEN ve sunucudan istemciye fonksiyon
 * geçilemiyor. Beşi de gerçek `Field` ile çiziliyor: etiket tek başına durmaz,
 * bir kontrolün adıdır · duran bir etiket resmi bunu gizlerdi.
 */
export function EtiketTurleri({
  fiyat,
  indirim,
  istegeBagli,
  kdv,
  kdvIpucu,
  teslimat,
}: {
  fiyat: string;
  indirim: string;
  istegeBagli: string;
  kdv: string;
  kdvIpucu: string;
  teslimat: string;
}) {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={fiyat}>
          <Input placeholder="0,00" />
        </Field>
        <Field label={fiyat} required>
          <Input placeholder="0,00" />
        </Field>
        <Field label={indirim} info={<Tag look="outline">{istegeBagli}</Tag>}>
          <Input placeholder="0" />
        </Field>
        <Field
          label={kdv}
          info={
            <span title={kdvIpucu} className="cursor-help">
              <Icon icon={Info} size="xs" />
            </span>
          }
        >
          <Input placeholder="%20" />
        </Field>
      </div>
      <Label look="section">{teslimat}</Label>
    </div>
  );
}
