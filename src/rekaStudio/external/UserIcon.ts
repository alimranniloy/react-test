import * as React from 'react';

const loadIcon = async () => {
  // Vite/ESM friendly dynamic import.
  return await import('@radix-ui/react-icons');
};

type UserIconProps = {
  name: string;
};

export const UserIcon = React.forwardRef<any, UserIconProps>((props, ref) => {
  const [icon, setIcon] = React.useState(null);

  React.useEffect(() => {
    loadIcon().then((res) => {
      if (!res[props.name]) {
        return;
      }

      setIcon(res[props.name]);
    });
  }, [props.name]);

  if (!icon) {
    return null;
  }

  return React.createElement(
    'span',
    {
      ref,
    },
    React.createElement(icon)
  );
});
