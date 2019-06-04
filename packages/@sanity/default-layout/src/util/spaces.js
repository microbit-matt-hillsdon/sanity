import config from 'config:sanity'
import {capitalize} from 'lodash'

const FEATURE_KEY = '__experimental_spaces'

export const CONFIGURED_SPACES = getConfiguredSpaces()
export const HAS_SPACES = CONFIGURED_SPACES && CONFIGURED_SPACES.length > 0

function getConfiguredSpaces() {
  const spacesConfig = config[FEATURE_KEY]
  if (!spacesConfig) {
    return null
  }
  const spaces = spacesConfig.map(prepareSpace)
  if (!spaces.some(s => s.default)) {
    // This will mean we prefer a development env for someone using `sanity start`.
    const matchesDataset = spaces.find(s => s.api.dataset === config.api.dataset)
    if (matchesDataset) {
      matchesDataset.default = true
    }
  }
  return spaces
}

function prepareSpace(space) {
  return Object.assign({}, space, {
    title: space.title || capitalize(space.name)
  })
}
