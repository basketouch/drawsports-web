-- Permitir a usuarios leer perfiles de su misma organización (para mostrar quién invitó)
CREATE POLICY "Users can read profiles in same org"
  ON profiles
  FOR SELECT
  USING (
    organization_id IS NOT NULL
    AND organization_id = (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );
