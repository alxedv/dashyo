declare interface getUserInfoProps {
  userId: string;
}

declare interface signInProps {
  email: string;
  password: string;
}

declare type SignUpParams = {
  name: string;
  email: string;
  password: string;
  role?: string;
  companyName?: string;
};

declare interface FooterProps {
  user: User;
  type?: 'mobile' | 'desktop';
}

declare interface SiderbarProps {
  user: User;
}