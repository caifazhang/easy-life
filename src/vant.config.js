import {
  Button,
  NavBar,
  Form,
  Field,
  Popup,
  Toast,
  Tabbar,
  TabbarItem,
  Search,
  Swipe,
  SwipeItem,
  Stepper,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Empty,
  SwipeCell,
  Checkbox,
  SubmitBar,
  List,
  AddressEdit,
  AddressList,
  Icon,
  Dialog,
  Tab,
  Tabs,
  Cell,
  Uploader
} from 'vant'


const vants = [
  Button,
  NavBar,
  Form,
  Field,
  Popup,
  Toast,
  Tabbar,
  TabbarItem,
  Search,
  Swipe,
  SwipeItem,
  Stepper,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Empty,
  SwipeCell,
  Checkbox,
  SubmitBar,
  List,
  AddressEdit,
  AddressList,
  Icon,
  Dialog,
  Tab,
  Tabs,
  Cell,
  Uploader
];

export default {
  install(Vue) {
    vants.forEach((comment) => {
      Vue.use(comment);
    });
  },
};
