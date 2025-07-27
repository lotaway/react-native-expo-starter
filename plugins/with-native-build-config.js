const { withAppBuildGradle, withProjectBuildGradle } = require('@expo/config-plugins')

const BUILD_CONFIG_FIELDS = [
  { type: 'boolean', name: 'IS_NEW_ARCHITECTURE_ENABLED', value: 'true' },
  { type: 'boolean', name: 'USE_HERMES', value: 'true' },
]

const withAppBuildConfig = config => {
  return withAppBuildGradle(config, config => {
    const contents = config.modResults.contents

    const buildTypesRegex = /buildTypes\s*{[\s\S]*?}/gm
    const match = contents.match(buildTypesRegex)
    if (!match) return config

    const injection = BUILD_CONFIG_FIELDS.map(
      f => `        buildConfigField "${f.type}", "${f.name}", "${f.value}"`
    ).join('\n')

    config.modResults.contents = contents.replace(
      buildTypesRegex,
      matchStr => {
        if (matchStr.includes('buildConfigField')) return matchStr
        return matchStr.replace(/}/, `${injection}\n    }`)
      }
    )

    return config
  })
}

const withProjectBuildSettings = config => {
  return withProjectBuildGradle(config, config => {
    const contents = config.modResults.contents

    // config.modResults.contents = contents
    //   .replace(/ext\s*{/, match => {
    //     return (
    //       match +
    //       `
    //     kotlinVersion = '1.9.0'
    //     compileSdkVersion = 34
    //     targetSdkVersion = 34
    //     minSdkVersion = 24
    //   `
    //     )
    //   })
    //   .replace(
    //     /dependencies\s*{[\s\S]*?}/m,
    //     match =>
    //       match +
    //       `
    //     classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:1.9.0")
    //   `
    //   )

    return config
  })
}

const withNativeBuildConfig = config => {
  if (process.env.SKIP_NATIVE_INJECT === '1') {
    console.log('🔧 Skipping native config injection (SKIP_NATIVE_INJECT=1)')
    return config
  }

  config = withAppBuildConfig(config)
  config = withProjectBuildSettings(config)
  return config
}

module.exports = withNativeBuildConfig
