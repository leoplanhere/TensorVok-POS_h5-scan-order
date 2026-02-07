import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTableStore = defineStore('table', () => {
    // --- 1. 初始化阶段：尝试从本地恢复数据 ---
    const savedTable = localStorage.getItem('currentTable')
    const savedOpenInfo = localStorage.getItem('tableOpenInfo')

    // 当前桌台信息
    const currentTable = ref(savedTable ? JSON.parse(savedTable) : null)
    
    // 开台记录
    const tableOpenInfo = ref(savedOpenInfo ? JSON.parse(savedOpenInfo) : {
        tableId: null,
        tableName: '',
        openTime: null,
        peopleCount: 0,
        status: 'empty', 
        remarks: '',
        tccode: '',
        reserve_list_id: null,
        staff_basics_id: null,
        staff_basics_ids: null,
        number: null,
    })

    // --- 2. Actions：同步更新缓存 ---

    // 绑定开台信息
    const bindTableInfo = (tableData) => {
        currentTable.value = tableData
        tableOpenInfo.value = {
            tableId: tableData.table_manage_id,
            tableName: tableData.tcname,
            tccode: tableData.tccode,
            number: tableData.number,
            openTime: new Date().toISOString(),
            peopleCount: tableData.number || null,
            status: 'occupied',
            staff_basics_id: tableData.staff_basics_id || null,
            staff_basics_ids: tableData.staff_basics_ids || null,
            reserve_list_id: tableData.reserve_list_id || null,
        }
        
        // 存入本地缓存
        localStorage.setItem('currentTable', JSON.stringify(currentTable.value))
        localStorage.setItem('tableOpenInfo', JSON.stringify(tableOpenInfo.value))
    }

    // 清除桌台信息
    const clearTableInfo = () => {
        currentTable.value = null
        tableOpenInfo.value = {
            tableId: null,
            tableName: '',
            openTime: null,
            peopleCount: 0,
            status: 'empty',
            remarks: ''
        }
        // 清除本地缓存
        localStorage.removeItem('currentTable')
        localStorage.removeItem('tableOpenInfo')
    }

    const getTableInfo = computed(() => tableOpenInfo.value)

    return {
        currentTable,
        tableOpenInfo,
        bindTableInfo,
        getTableInfo,
        clearTableInfo
    }
})