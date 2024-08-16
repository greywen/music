function MoreIcon(props?: {
  svg?: React.SVGProps<SVGSVGElement>;
  path?: React.SVGProps<SVGPathElement>;
}) {
  return (
    <svg
      viewBox='0 0 1024 1024'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      width='26'
      height='26'
      {...props?.svg}
    >
      <path
        d='M768 426.666667a85.333333 85.333333 0 1 1-85.333333 85.333333 85.333333 85.333333 0 0 1 85.333333-85.333333z m-170.666667 85.333333a85.333333 85.333333 0 1 0-85.333333 85.333333 85.333333 85.333333 0 0 0 85.333333-85.333333z m-256 0a85.333333 85.333333 0 1 0-85.333333 85.333333 85.333333 85.333333 0 0 0 85.333333-85.333333z'
        fill='#2c2c2c'
        {...props?.path}
      ></path>
    </svg>
  );
}

export default MoreIcon;
