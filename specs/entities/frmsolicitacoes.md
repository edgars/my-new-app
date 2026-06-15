# Frmsolicitacoes

- Route: `/frmsolicitacoes`
- API base: `/api/frmsolicitacoes`

## Fields (render in this order)

| Field | Label | Type | Required | Component | List column |
|---|---|---|---|---|---|
| mskPermissao | Msk Permissao | text | no | input | yes |

## CRUD to implement

- `GET /api/frmsolicitacoes` — paginated list (`page`, `limit`)
- `POST /api/frmsolicitacoes` — create (validate body)
- `GET /api/frmsolicitacoes/:id` — read one
- `PUT /api/frmsolicitacoes/:id` — update
- `DELETE /api/frmsolicitacoes/:id` — delete

## UI pages

- List `/frmsolicitacoes` — table of the *list column* fields + search + pagination
- Create `/frmsolicitacoes/new` — form of all fields, in order
- Edit `/frmsolicitacoes/[id]/edit` — same form, prefilled, with delete
