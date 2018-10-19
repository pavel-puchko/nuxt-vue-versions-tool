<template>
  <div>
    <nuxt-link to="/">
      <h1 class="text-center page-title">
        <i class="el-icon-back back-icon"></i> Back to projects
      </h1>
    </nuxt-link>
    <el-row :gutter="40" v-if="currentProject">
      <el-col :md="6">
        <project-card :project="currentProject" :platform="currentPlatform"></project-card>
      </el-col>
      <el-col :md="18">
          <el-tabs :value="currentPlatform.name" type="border-card" @tab-click="handlePlatformChange">
            <el-tab-pane
              v-for="platform in currentProject.platforms"
              :key="platform.name"
              :name="platform.name"
              :label="platform.name">
              <platform-submodules :platform="platform"></platform-submodules>
            </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <h1 v-else class="project-not-found text-center">
      Project not found
    </h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ProjectCard from '~/components/ProjectCardComponent.vue';
import PlatformSubmodules from '~/components/PlatformSubmodulesComponent.vue';

export default {
  name: 'ProjectView',
  components: {
    'platform-submodules': PlatformSubmodules,
    'project-card': ProjectCard,
  },
  async fetch({ store, params, $axios }) {
    store.dispatch('setCurrentProjectName', params.name);
    const currentProject = store.getters.currentProject;

    if (currentProject && currentProject.platforms.length) {
      const selectedPlatformName = params.platform ?
        params.platform :
        currentProject.platforms[0].name 
      store.dispatch('setCurrentPlatformName', selectedPlatformName);
      const platform = store.getters.currentPlatform;
      if (!platform.loaded) {
        const platformData = await $axios.$get(platform.path);
        store.commit('SET_PLATFORM_DATA', {
          platformName: platform.name,
          platformData,
        })
      }
    }
  },
  head () {
    return {
      title: this.currentProject.name,
    }
  },
  computed: {
    ...mapGetters([
      'currentProject',
      'currentPlatform',
    ]),
  },
  methods: {
    handlePlatformChange({ label: platformName }) {
      this.$router.push(`/project/${this.currentProject.name}/${encodeURIComponent(platformName)}`);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';

a {
  text-decoration: none;
  :hover {
    opacity: 0.8;
  }
}

.page-title {
  color: $mainColor;
}

.project-not-found {
  margin-top: 150px;
  text-align: center;
  color: $dangerColor;
  font-size: 56px;
}

.el-row .el-col {
  margin-top: 30px;
}
</style>
