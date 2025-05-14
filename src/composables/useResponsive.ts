import { ref, onMounted, onUnmounted } from 'vue'

export const useResCols = () => {
    const cols = ref(1)

    const updateCols = () => {
        const width = window.innerWidth;

        if (width < 768) cols.value = 1
        else cols.value = 2                  
    }

    onMounted(() =>{
        updateCols()
        window.addEventListener('resize', updateCols);
    })

    onUnmounted(() => {
        window.removeEventListener('resize', updateCols);
    })

    return cols;
}

export const useResChart = () => {
    const chartWidth = ref(500)

    const updateWidth = () => {
        const width = window.innerWidth;

        if (width < 800) chartWidth.value = 300
        else if(width < 1000) chartWidth.value = 400
        else if(width < 1400) chartWidth.value = 500
        else chartWidth.value = 600                  
    }

    onMounted(() =>{
        updateWidth()
        window.addEventListener('resize', updateWidth);
    })

    onUnmounted(() => {
        window.removeEventListener('resize', updateWidth);
    })

    return chartWidth;
}