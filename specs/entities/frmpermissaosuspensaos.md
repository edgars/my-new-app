# Frmpermissaosuspensao

- Route: `/frmpermissaosuspensaos`
- API base: `/api/frmpermissaosuspensaos`

## Fields (render in this order)

| Field | Label | Type | Required | Component | List column |
|---|---|---|---|---|---|
| mskTa | Msk Ta | text | no | input | yes |
| mskLacres | Msk Lacres | text | no | input | yes |
| mskDtLimiteVeic | Msk Dt Limite Veic | text | no | input | yes |

## CRUD to implement

- `GET /api/frmpermissaosuspensaos` — paginated list (`page`, `limit`)
- `POST /api/frmpermissaosuspensaos` — create (validate body)
- `GET /api/frmpermissaosuspensaos/:id` — read one
- `PUT /api/frmpermissaosuspensaos/:id` — update
- `DELETE /api/frmpermissaosuspensaos/:id` — delete

## UI pages

- List `/frmpermissaosuspensaos` — table of the *list column* fields + search + pagination
- Create `/frmpermissaosuspensaos/new` — form of all fields, in order
- Edit `/frmpermissaosuspensaos/[id]/edit` — same form, prefilled, with delete
