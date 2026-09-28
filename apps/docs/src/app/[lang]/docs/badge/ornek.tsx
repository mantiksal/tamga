"use client";

import { Badge, Icon, IconButton } from "tamga-ui";
import { ShoppingCart } from "tamga-ui/icons";

/**
 * Sayısız rozet · sepetin köşesindeki işaret.
 *
 * İstemci dosyası, çünkü glif bir BİLEŞEN ve sunucudan istemciye fonksiyon
 * geçilemiyor. Metinler yine prop.
 */
export function NoktaRozeti({ sepet, yeniUrun }: { sepet: string; yeniUrun: string }) {
  return (
    <span className="flex items-center gap-6">
      <Badge dot tone="info" label={yeniUrun}>
        <IconButton aria-label={sepet}>
          <Icon icon={ShoppingCart} size="sm" />
        </IconButton>
      </Badge>
      <Badge dot tone="danger" label={yeniUrun} />
    </span>
  );
}
