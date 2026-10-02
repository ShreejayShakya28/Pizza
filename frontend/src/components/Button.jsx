const BASE =
  'rounded-full px-4 py-2 font-semibold transition focus-visible:outline-2 ' +
  'focus-visible:outline-offset-2 focus-visible:outline-enamel ' +
  'disabled:cursor-not-allowed disabled:opacity-40';

const VARIANTS = {
  primary: 'bg-enamel text-white hover:brightness-110',
  ghost: 'border-2 border-ink/20 hover:border-ink/40',
};

export default function Button({ variant = 'primary', className = '', ...props }) {
  return <button type="button" className={`${BASE} ${VARIANTS[variant]} ${className}`} {...props} />;
}
