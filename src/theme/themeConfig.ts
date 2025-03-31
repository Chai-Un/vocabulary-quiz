import { ThemeConfig } from 'antd';
import { colorPrimary, colorSuccess, colorWarning, colorDanger } from './colors';

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary,
    colorSuccess,
    colorWarning,
    colorError: colorDanger,
    // You can add more token customizations here
  },
  components: {
    // Component-specific customizations can go here
    Button: {
      // colorPrimary: colorSuccess, // Example of component-specific override
    },
  },
};

export default themeConfig;
