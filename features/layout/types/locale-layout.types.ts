type Props = {
  params: Promise<{ locale: string }>;
};

export type LocaleLayoutProps = React.PropsWithChildren<Props>;