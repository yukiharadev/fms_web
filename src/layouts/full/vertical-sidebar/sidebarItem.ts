import {
  LayoutDashboardIcon,
  BuildingIcon,
  PointIcon,
  UserCircleIcon,
  BrandOauthIcon,
  AdjustmentsDollarIcon,
  CopyrightIcon,
} from 'vue-tabler-icons'

export interface menu {
  header?: string
  title?: string
  icon?: any
  to?: string
  chip?: string
  chipColor?: string
  chipBgColor?: string
  chipVariant?: string
  chipIcon?: string
  children?: menu[]
  disabled?: boolean
  type?: string
  subCaption?: string
  external?: boolean
}

const sidebarItem: menu[] = [
  { header: 'Home' },
  {
    title: 'Trang chủ',
    icon: LayoutDashboardIcon,
    to: '/',
    external: false,
  },
  { header: 'Company' },
  {
    title: 'Thể loại',
    icon: LayoutDashboardIcon,
    chipColor: 'primary',
    chipBgColor: 'lightprimary',
    external: false,
    to: '/company/business-category',
  },
  {
    title: 'Công ty',
    icon: BuildingIcon,
    chipColor: 'primary',
    chipBgColor: 'lightprimary',
    to: '/company/all-companies',

    external: false,
  },
  {
    title: 'Tài chính',
    icon: AdjustmentsDollarIcon,
    chipColor: 'primary',
    chipBgColor: 'lightprimary',
    to: '/financial/import',
    external: false,
  },
  {
    title: 'Quản lý người dùng',
    icon: BrandOauthIcon,
    chipColor: 'primary',
    chipBgColor: 'lightprimary',
    children: [
      {
        title: 'Tất cả người dùng',
        chipColor: 'primary',
        chipBgColor: 'lightprimary',
        icon: PointIcon,
        to: '/auth/all-users',
        external: false,
      },
      {
        title: 'Roles',
        chipColor: 'primary',
        chipBgColor: 'lightprimary',
        icon: PointIcon,
        to: '/auth/roles',
        external: false,
      },
    ],
  },
  { header: 'Person' },
  {
    title: 'CEO',
    icon: CopyrightIcon,
    chipColor: 'primary',
    chipBgColor: 'lightprimary',
    to: '/ceo',
    external: false,
  },
]

export default sidebarItem
