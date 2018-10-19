import * as mtypes from './mutation-types';
import projectsConfig from '../new-versions.config.json';

const projectsList = projectsConfig.projects.map(project => ({
  name: project.name,
  platforms: project.platforms.map(platform => ({
    name: platform.name,
    path: `${projectsConfig.url}/${projectsConfig.repo}/${platform.path}`,
    submodules: [],
    loaded: false,
    browseUrl: '',
    contentId: '',
    description: '',
    repositoryUrl: '',
  })),
}));

export const state = () =>  ({
  projectsList,
  currentProjectName: '',
  currentPlatformName: '',
})

export const getters = {
  currentProject: state => state.projectsList.find(project => project.name === state.currentProjectName),
  currentPlatform: (state, getters) => {
    if (!getters.currentProject) {
      return null;
    }
    return getters.currentProject.platforms
      .find(platform => platform.name === state.currentPlatformName);
  },
}


export const mutations = {
  [mtypes.SET_CURRENT_PROJECT_NAME](state, { projectName }) {
    state.currentProjectName = projectName;
  },
  [mtypes.SET_CURRENT_PLATFORM_NAME](state, { platformName }) {
    state.currentPlatformName = platformName;
  },
  [mtypes.SET_PLATFORM_DATA](state, { platformName, platformData = { submodules: [] } }) {
    const project = state.projectsList.find(p => p.name === state.currentProjectName) || {};
    const platform = project.platforms.find(p => p.name === platformName);
    platform.submodules = platformData.submodules;
    platform.description = platformData.description;
    platform.browseUrl = platformData.browseUrl;
    platform.repositoryUrl = platformData.repositoryUrl;
    platform.contentId = platformData.contentId;
    platform.loaded = true;
  },
};

export const actions = {
  setCurrentProjectName({ commit }, projectName) {
    commit(mtypes.SET_CURRENT_PROJECT_NAME, {
      projectName,
    });
  },
  setCurrentPlatformName({ commit }, platformName) {
    commit(mtypes.SET_CURRENT_PLATFORM_NAME, {
      platformName,
    });
  },
};