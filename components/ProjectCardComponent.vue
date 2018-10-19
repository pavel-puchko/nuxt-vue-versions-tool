<template>
  <el-card>
    <img :src="getProjectPhotoUrl()" :alt="project.name" class="image">
    <div class="project-info text-center">
      <template v-if="!platform">
        <h2 class="project-name capitalize">{{project.name}}</h2>
        <no-ssr>
          <nuxt-link
            v-for="(platform, index) in project.platforms"
            :key="platform.name"
            :to="'project/'+ project.name + '/' + encodeURIComponent(platform.name)">
            <span class="project-platform">
              {{platform.name}}<template v-if="index !== project.platforms.length - 1">,</template>
            </span>
          </nuxt-link>
        </no-ssr>
      </template>
      <template v-else>
        <h2 class="project-name capitalize">
          <a :href="platform.repositoryUrl" target="blank">{{project.name}}</a>
        </h2>
        <a :href="platform.browseUrl" target="blank" v-if="platform.contentId">
          <span>[{{platform.contentId}}]</span>
        </a>
        <p class="platform-description">{{platform.description}}</p>
      </template>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'ProjectCardComponent',
  props: {
    project: Object,
    platform: Object,
  },
  methods: {
    getProjectPhotoUrl() {
      return `/images/${this.project.name.toLowerCase()}.jpg`;
    },
    getPlatformLink(platformName) {
      return `project/${this.project.name}/platformName`;
    },
  },
};
</script>

<style lang="scss">
@import '../assets/css/variables.scss';

a {
  color: $mainColor;
  text-decoration: none;
}

.project-info {
  margin-top: 20px;
}

.project-name {
  margin-bottom: 10px;
}

.project-platform {
  font-size: 20px;
}

.project-platform, .platform-description {
  color: $secondaryTextColor;
}

.platform-description {
  margin-top: 16px;
}

.image {
  width: 100%;
  display: block;
}
</style>
