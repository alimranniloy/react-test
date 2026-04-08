export const GOOGLE_FONT_OPTIONS = [
  {
    value: '"Outfit", sans-serif',
    label: 'Outfit',
    sample: 'Balanced modern UI',
  },
  {
    value: '"Inter", sans-serif',
    label: 'Inter',
    sample: 'Neutral interface text',
  },
  {
    value: '"Manrope", sans-serif',
    label: 'Manrope',
    sample: 'Clean geometric tone',
  },
  {
    value: '"Poppins", sans-serif',
    label: 'Poppins',
    sample: 'Rounded friendly display',
  },
  {
    value: '"DM Sans", sans-serif',
    label: 'DM Sans',
    sample: 'Soft editorial sans',
  },
  {
    value: '"Space Grotesk", sans-serif',
    label: 'Space Grotesk',
    sample: 'Tech-forward headline',
  },
  {
    value: '"Rubik", sans-serif',
    label: 'Rubik',
    sample: 'Warm product copy',
  },
  {
    value: '"IBM Plex Sans", sans-serif',
    label: 'IBM Plex Sans',
    sample: 'Precise system voice',
  },
  {
    value: '"Nunito", sans-serif',
    label: 'Nunito',
    sample: 'Friendly rounded text',
  },
  {
    value: '"Fira Sans", sans-serif',
    label: 'Fira Sans',
    sample: 'Readable utility font',
  },
  {
    value: '"Playfair Display", serif',
    label: 'Playfair Display',
    sample: 'Elegant editorial serif',
  },
  {
    value: '"Merriweather", serif',
    label: 'Merriweather',
    sample: 'Readable content serif',
  },
  {
    value: '"Source Serif 4", serif',
    label: 'Source Serif 4',
    sample: 'Modern publishing serif',
  },
  {
    value: '"Bebas Neue", sans-serif',
    label: 'Bebas Neue',
    sample: 'Tall poster display',
  },
].map((font) => ({
  value: font.value,
  title: (
    <div className="flex flex-col">
      <span
        className="text-[12px] font-semibold text-slate-900"
        style={{ fontFamily: font.value }}
      >
        {font.label}
      </span>
      <span className="text-[10px] text-slate-500">{font.sample}</span>
    </div>
  ),
}));
