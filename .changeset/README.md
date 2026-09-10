# Changesets

`package.json`'daki `release` betiği `changeset publish` çağırıyor ve bu klasör olmadan o komut
**çalışmıyordu**, yani yayınlama yolu, ilk kez denenene kadar sessizce kırıktı. Bu dosya o
boşluğun kapanışı.

## Nasıl kullanılır

```bash
pnpm changeset          # neyin değiştiğini ve sürümün nasıl artacağını yaz
pnpm changeset version  # sürümleri ve CHANGELOG'u güncelle
pnpm release            # derle ve yayınla
```

`tamga-docs` `ignore` listesinde: doküman sitesi yayınlanmıyor, yalnız bu depoda yaşıyor.
