<template>
  <el-table
    ref="projectSubmodulesTable"
    :default-sort = "{prop: 'name', order: 'ascending'}"
    :data="platform.submodules"
    :row-class-name="tableRowClassName"
    :height="tableMaxHeight"
    :empty-text="!platform.loaded ? 'Loading...' : 'No submodules'"
    @row-click="handleRowClick"
    style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="props">
        <template v-if="props.row.tags.length">
          <h5 class="expand-header">Latest versions</h5>
          <p class="version-info"
            v-for="(tag, index) in getFilteredTags(props.row)"
            :class="{ current: tag.tagId === props.row.contentId}"
            :key="tag.tagId">
            <a :href="getUrlToChangelog(props.row, tag)" target="_blank" class="version-number">
              {{tag.tagId}}
            </a>
            <span class="version-date">
              — {{getFormattedDate(tag.timestamp)}}
            </span>
            <span
              v-if="tag.tagId === props.row.contentId && index > 0"
              class="versions-diff">
              | {{index}} version<template v-if="index > 1">s</template> ahead
            </span>
          </p>
        </template>
        <template v-else>
          <p class="no-versions">No versions</p>
        </template>
      </template>
    </el-table-column>
    <el-table-column
      sortable
      prop="name"
      width="250"
      label="Name">
      <template slot-scope="scope">
        <a @click.stop :href="scope.row.repositoryUrl" target="_blank">{{scope.row.name}}</a>
      </template>
    </el-table-column>
    <el-table-column
      min-width="350"
      label="Content">
      <template slot-scope="scope">
        <a @click.stop :href="scope.row.browseUrl" target="_blank">
          <i
            class="el-icon-time old-version-icon"
            v-if="showOldVersionIcon(scope.row)"></i>
          {{scope.row.contentId}}
        </a>
      </template>
    </el-table-column>
    <el-table-column
      :filters="getSubmodulesFilters()"
      :filter-method="filterMatchingType"
      width="150"
      label="Type">
      <template slot-scope="scope">
        <span @click.stop>{{scope.row.matchingType}}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getFormattedDate } from '../assets/js/date-utils.js';

const SUBMODULE_TABLE_OFFSET_IN_PX = 210;
const SUBMODULE_TABLE_MIN_HEIGHT = 300;
const MAX_VERSIONS_COUNT_IN_EXPAND = 5;

let windowObj = process.browser ? window : {};

export default {
  name: 'PlatformSubmodulesComponent',
  data() {
    return {
      tableMaxHeight: 0,
    };
  },
  props: {
    platform: Object,
  },
  created() {
    this.calculateTableHeigth();
    windowObj.onresize = this.onWindowResize;
  },
  methods: {
    tableRowClassName({ row }) {
      switch (row.matchingType) {
        case 'UNDEFINED': return 'danger-row';
        case 'TAG': return row.tags[0].tagId !== row.contentId ? 'warning-row' : 'success-row';
        case 'BRANCH': return 'warning-row';
        default: return 'success-row';
      }
    },
    showOldVersionIcon(row) {
      return row.matchingType === 'TAG' && row.tags.length && row.tags[0].tagId !== row.contentId;
    },
    calculateTableHeigth() {
      const height = windowObj.innerHeight - SUBMODULE_TABLE_OFFSET_IN_PX;
      this.tableMaxHeight = height < SUBMODULE_TABLE_MIN_HEIGHT ?
        SUBMODULE_TABLE_MIN_HEIGHT :
        height;
    },
    getFilteredTags(row) {
      const currentVersionIndex = row.tags.findIndex(t => t.tagId === row.contentId);

      if (currentVersionIndex < MAX_VERSIONS_COUNT_IN_EXPAND) {
        return row.tags.slice(0, MAX_VERSIONS_COUNT_IN_EXPAND);
      }

      return row.tags.slice(0, currentVersionIndex + 1);
    },
    onWindowResize() {
      this.calculateTableHeigth();
      this.$refs.projectSubmodulesTable.doLayout();
    },
    filterMatchingType(value, row) {
      return row.matchingType === value;
    },
    getSubmodulesFilters() {
      return [
        { text: 'UNDEFINED', value: 'UNDEFINED' },
        { text: 'BRANCH', value: 'BRANCH' },
        { text: 'TAG', value: 'TAG' },
        { text: 'DEFAULT', value: 'DEFAULT' },
      ];
    },
    getUrlToChangelog(row, tag) {
      return `${row.repositoryUrl}/CHANGELOG.md?at=refs/tags/${tag.tagId}`;
    },
    handleRowClick(row) {
      this.$refs.projectSubmodulesTable.toggleRowExpansion(row);
    },
    getFormattedDate,
  },
  beforeDestroy() {
    windowObj.onresize = null;
  },
};
</script>

<style lang="scss">
@import '../assets/css/variables.scss';

.expand-header, .no-versions {
  margin-bottom: 8px;
}

.el-icon-time.old-version-icon {
  color: #F56C6C;
  font-weight: bold;
}

.version-info {
  & + .version-info {
    margin-top: 8px;
  }
  .version-number  {
    text-decoration: underline;
  }
  &:not(.current) .version-number {
    color: $regularTextColor;
  }
  &.current {
    .version-number, .version-date {
      color: $successColor;
    }

  }
  & + &.current {
    .version-number, .version-date {
      color: $dangerColor;
    }
  }
}

.version-date, .no-versions, .versions-diff  {
  color: $secondaryTextColor;
}
</style>
