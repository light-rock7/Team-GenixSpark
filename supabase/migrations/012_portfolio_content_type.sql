alter table public.portfolio_items
  add column if not exists content_type text;

create index if not exists idx_portfolio_content_type
  on public.portfolio_items(content_type)
  where content_type is not null;

comment on column public.portfolio_items.content_type is
  'Primary output/content type represented by this portfolio case study, used as a discovery signal.';
