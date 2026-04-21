export default function CompanySwitcher({ companies }) {
  const { switchCompany } = useCompany();

  return (
    <select onChange={(e) => switchCompany(e.target.value)}>
      {companies.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name} ({c.role})
        </option>
      ))}
    </select>
  );
}