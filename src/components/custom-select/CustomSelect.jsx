import Select from "react-select";

const customStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: '40px',
    border: state.isFocused ? '2px solid hsl(212 100% 47%)' : '2px solid hsl(240 5% 84%)',
    borderRadius: '0.75rem',
    backgroundColor: state.isFocused ? 'hsl(240 5% 96%)' : 'hsl(240 5% 96%)',
    boxShadow: 'none',
    cursor: 'pointer',
    outline: 'none',
    transition: 'background-color 0.25s ease, border-color 0.25s ease, opacity 0.25s ease, box-shadow 0.25s ease',
    '&:hover': {
      backgroundColor: 'hsl(240 4% 90%)',
      borderColor: state.isFocused ? 'hsl(212 100% 47%)' : 'hsl(240 4% 75%)',
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0.5rem 0.75rem',
    gap: '0.25rem',
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
    color: 'hsl(240 6% 10%)',
  }),
  placeholder: (base) => ({
    ...base,
    color: 'hsl(240 4% 46%)',
    fontSize: '0.875rem',
    fontWeight: '400',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'hsl(240 6% 10%)',
    fontSize: '0.875rem',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: 'hsl(240 4% 46%)',
    padding: '0.5rem',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: 'hsl(240 4% 26%)',
    },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: 'hsl(240 4% 46%)',
    padding: '0.5rem',
    cursor: 'pointer',
    '&:hover': {
      color: 'hsl(0 72% 51%)',
    },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '0.875rem',
    boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.02), 0px 2px 10px 0px rgba(0, 0, 0, 0.06), 0px 0px 1px 0px rgba(0, 0, 0, 0.3)',
    border: 'none',
    marginTop: '0.25rem',
    overflow: 'hidden',
    zIndex: 9999,
    backgroundColor: 'hsl(0 0% 100%)',
  }),
  menuList: (base) => ({
    ...base,
    padding: '0.25rem',
    maxHeight: '256px',
  }),
  option: (base, state) => ({
    ...base,
    borderRadius: '0.5rem',
    padding: '0.5rem 0.75rem',
    margin: '0.125rem 0',
    cursor: 'pointer',
    fontSize: '0.875rem',
    color: state.isSelected ? 'hsl(0 0% 100%)' : 'hsl(240 6% 10%)',
    backgroundColor: state.isSelected
      ? 'hsl(212 100% 47%)'
      : state.isFocused
      ? 'hsl(240 5% 96%)'
      : 'transparent',
    fontWeight: state.isSelected ? '500' : '400',
    transition: 'background-color 0.15s ease, color 0.15s ease',
    '&:active': {
      backgroundColor: state.isSelected ? 'hsl(212 100% 42%)' : 'hsl(240 4% 90%)',
    },
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'hsl(212 100% 95%)',
    borderRadius: '0.5rem',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'hsl(212 100% 47%)',
    fontSize: '0.875rem',
    padding: '0.25rem 0.5rem',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: 'hsl(212 100% 47%)',
    cursor: 'pointer',
    borderRadius: '0 0.5rem 0.5rem 0',
    '&:hover': {
      backgroundColor: 'hsl(212 100% 90%)',
      color: 'hsl(212 100% 42%)',
    },
  }),
  loadingIndicator: (base) => ({
    ...base,
    color: 'hsl(212 100% 47%)',
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color: 'hsl(240 4% 46%)',
    fontSize: '0.875rem',
    padding: '0.75rem',
  }),
};

export default function CustomSelect(props) {
  return <Select {...props} styles={customStyles} classNamePrefix="react-select" />;
}
