export default defineAppConfig({
  ui: {
    colors: {
      primary: 'brandPrimary',
      secondary: 'brandSecondary',
      tertiary: 'brandTertiary',
      neutral: 'brandNeutral',
      success: 'green',   
      info: 'blue',
      warning: 'amber',
      error: 'red'
    },
    dashboardPanel: {
      slots: {
        body: "flex flex-col gap-4 sm:gap-6 flex-1 overflow-y-auto p-0 sm:p-0",
      },
    },
    
  }, 
})
