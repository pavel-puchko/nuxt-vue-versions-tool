<template>
  <div>
      <h1 class="text-center">Projects</h1>
      <el-row :gutter="40">
        <el-col :sm="12" :md="8" :lg="6" :xl="4" v-for="project in projectsList" :key="project.id">
          <nuxt-link :to="'project/' + project.name">
            <project-card :project="project"></project-card>
          </nuxt-link>
        </el-col>
      </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ProjectCard from '../components/ProjectCardComponent.vue';

export default {
  name: 'ProjectsListView',
  title: 'Projects',
  components: {
    'project-card': ProjectCard,
  },
  head: {
    title: 'Projects'
  },
  computed: {
    ...mapState([
      'projectsList',
    ]),
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/css/variables.scss';

h1 {
  color: $mainColor;
}

a {
  text-decoration: none;
}

.el-col {
  margin-top: 30px;
}

.el-card:hover {
  cursor: pointer;
  box-shadow: 0 2px 12px 0 $mainColor;
}
</style>
