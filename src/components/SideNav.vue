<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import type { Component } from 'vue'
import {
BookOutline as BookIcon,
PersonOutline as PersonIcon,
WineOutline as WineIcon
} from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import { h, ref } from 'vue'
import Dashboard from './Dashboard.vue'
  
const activeKey = ref<string | null>(null);
const collapsed = ref(true);

function renderIcon(icon: Component) {
return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
{
    label: 'Home',
    key: 'home',
    icon: renderIcon(BookIcon)
},
{
    label: 'Dashboard',
    key: 'dashboard',
    icon: renderIcon(BookIcon)
},
{
    label: 'Settings',
    key: 'settings',
    icon: renderIcon(BookIcon),
    children: [
    {
        label: 'Preferences',
        key: 'preferences',
        icon: renderIcon(WineIcon),
    },
    {
        label: 'Account',
        key: 'account',
    },
    {
        label: 'Logout',
        key: 'logout',
        icon: renderIcon(PersonIcon),
    }
    ]
}
]
</script>

<template>
    <n-space vertical>
      <n-layout has-sider style="height:100vh">
        <n-layout-sider
          bordered
          collapse-mode="width"
          :collapsed-width="64"
          :width="240"
          :collapsed="collapsed"
          show-trigger
          @collapse="collapsed = true"
          @expand="collapsed = false"
        >
          <n-menu
            v-model:value="activeKey"
            :collapsed="collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
          />
        </n-layout-sider>
        <n-layout>
            <Dashboard/>
        </n-layout>
      </n-layout>
    </n-space>
</template>
