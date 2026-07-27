CREATE TABLE public.wishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  relationship text,
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT wishes_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT wishes_message_not_empty CHECK (length(trim(message)) > 0)
);

GRANT SELECT, INSERT ON public.wishes TO anon;
GRANT SELECT, INSERT ON public.wishes TO authenticated;
GRANT ALL ON public.wishes TO service_role;

ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public wishes are visible"
ON public.wishes
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can leave a wish"
ON public.wishes
FOR INSERT
TO anon, authenticated
WITH CHECK (length(trim(name)) > 0 AND length(trim(message)) > 0);