alter table public.creative_briefs
  add column if not exists content_type text,
  add column if not exists style text;

create index if not exists idx_briefs_content_type
  on public.creative_briefs(content_type)
  where content_type is not null;

comment on column public.creative_briefs.content_type is
  'Primary deliverable/content type such as image, video, animation, graphics, product visuals, or social content.';

comment on column public.creative_briefs.style is
  'Creative style, mood, visual direction, or aesthetic requirements for the brief.';
