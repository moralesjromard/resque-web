<template>
  <MainLayout>
    <div style="padding: 2rem;" class="main">
      <div class="card-container">
        <div class="card">
          <div class="card-content">
            <label class="card-label">Total Complaints</label>
            <span class="card-count">12</span>
          </div>
          <div class="card-icon">
            <i class="pi pi-book" />
          </div>
        </div>
        <div class="card">
          <div class="card-content">
            <label class="card-label">Total Documents</label>
            <span class="card-count">4</span>
          </div>
          <div class="card-icon card-icon-document">
            <i class="pi pi-file" />
          </div>
        </div>
      </div>
      <div class="chart-container">
        <div class="bard-chart-container">
          <Chart type="bar" :data="barChartData" :options="barChartOptions" class="bar-chart"  />
        </div>
        <div class="doughnut-chart-container">
          <Chart type="doughnut" :data="doughnutChartData" :options="doughnutOptions" class="doughnut-chart" />
        </div>
      </div>
    </div>
    <div class="login-history">
      <p class="login-history-title">Login history</p>
      <div class="login-history-item">
        <p class="login-history-description-intro">Your last login was:</p>
        <p class="login-history-date">Feb 02 2024 at 11:38:21 AM (GMT +8)</p>
      </div>
      <div class="login-history-item">
        <p class="login-history-description-intro">Your last failed login was:</p>
        <p class="login-history-date">March 01 2024 at 5:38:21 PM (GMT +8)</p>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
  import { ref, onMounted } from 'vue';

  import MainLayout from "~/layouts/MainLayout.vue";
  import Chart from 'primevue/chart';

  onMounted(() => {
    barChartData.value = setBarChartData();
    barChartOptions.value = setBarChartOptions();

    doughnutChartData.value = setDoughnutChartData();
    doughnutOptions.value = setDoughnutChartOptions();
  });

  const barChartData = ref();
  const barChartOptions = ref();

  const doughnutChartData = ref();
  const doughnutOptions = ref();

  const setBarChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Complaints dataset',
                backgroundColor: documentStyle.getPropertyValue('--cyan-500'),
                borderColor: documentStyle.getPropertyValue('--cyan-500'),
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: 'Documents dataset',
                backgroundColor: documentStyle.getPropertyValue('--gray-500'),
                borderColor: documentStyle.getPropertyValue('--gray-500'),
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };
  };

  const setBarChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    return {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
              color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
              color: textColorSecondary,
              font: {
                  weight: 500
              }
          },
          grid: {
              display: false,
              drawBorder: false
          }
        },
        y: {
          ticks: {
              color: textColorSecondary
          },
          grid: {
              color: surfaceBorder,
              drawBorder: false
          }
        }
      }
    };
  }

  const setDoughnutChartData = () => {
    const documentStyle = getComputedStyle(document.body);

    return {
      labels: ['Total complaints', 'Total Documents'],
      datasets: [
        {
          data: [540, 325],
          backgroundColor: [documentStyle.getPropertyValue('--cyan-500'), documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--gray-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--cyan-400'), documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--gray-400')]
        }
      ]
    };
  };

  const setDoughnutChartOptions = () => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      return {
          plugins: {
              legend: {
                  labels: {
                      cutout: '60%',
                      color: textColor
                  }
              }
          }
      };
  };
</script>

<style scoped>
  .card-container {
    display: flex;
    gap: 2rem;
  }

  .card {
    background: white;
    width: fit-content;
    padding: 1.5rem;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-direction: row-reverse;
    padding-right: 2.5rem;
  }

  .card-content {
    display: flex;
    flex-direction: column;
  }  

  .card-label {
    font-size: 1.3rem;
    font-weight: 400;
    color: #334155;
    margin-bottom: 0.5rem;
  }

  .card-count {
    font-size: 2.5rem;
    font-weight: bold;
    color: #1D1D1F;
    text-align: center;
  }

  .card-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #06c;
    width: 70px;
    height: 70px;
    border-radius: 50px;
    background: url('/complaint-color2.jpg');
  }

  .card-icon-document {
    background: url('/documentrequest-color.jpg');
  }

  .card-icon i {
    font-size: 2rem;
    color: #FFF;
  }

  .chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    width: fit-content;
    gap: 4rem;
  }

  .bar-chart {
    width: 600px;
    height: 300px;
  }

  .doughnut-chart {
    width: 300px;
    height: 300px;
  }

  .login-history {
    padding: 2rem;
  }

  .login-history-title {
    font-size: 1.3rem;
    font-weight: bold;
    color: #1D1D1F;
    margin: 0;
  }

  .login-history-item {
    display: flex;
    flex-direction: column;
    margin: 0;
    margin-top: 1rem;
    gap: 0.3rem;
  }

  .login-history-description-intro {
    margin: 0;
    color: #1D1D1F;
    font-weight: 500;
  }

  .login-history-date {
    margin: 0;
    color: #565656;
    font-size: 14px;
    font-weight: 500;
  }

</style>