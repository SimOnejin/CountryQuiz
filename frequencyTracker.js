// 빈도수 관리 모듈
export const QuestionFrequencyTracker = {
    frequency: {},

    // 빈도수 로드 (로컬 스토리지에서)
    loadFrequency() {
        const savedFrequency = localStorage.getItem('questionFrequency');
        this.frequency = savedFrequency ? JSON.parse(savedFrequency) : {};
    },

    // 빈도수 저장 (로컬 스토리지에)
    saveFrequency() {
        localStorage.setItem('questionFrequency', JSON.stringify(this.frequency));
    },

    // 빈도수 초기화
    resetFrequency() {
        localStorage.clear();
    },

    // 특정 국가의 출제 빈도수 업데이트
    updateFrequency(country) {
        if (!this.frequency[country]) {
            this.frequency[country] = 0;
        }
        this.frequency[country]++;
        this.saveFrequency();
    },

    // 빈도수 출력
    getSortedFrequency() {
        return Object.entries(this.frequency).sort((a, b) => b[1] - a[1]);
    },

    // 빈도수 초기화
    resetFrequency() {
        this.frequency = {};
        this.saveFrequency();
    }
};
