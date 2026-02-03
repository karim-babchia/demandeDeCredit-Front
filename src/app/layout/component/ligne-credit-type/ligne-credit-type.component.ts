import { LigneCreditService } from './../../service/ligne-credit.service';
import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../service/layout.service';
import { LigneCredit } from '../../../model/ligne-credit';

@Component({
  selector: 'app-ligne-credit-type',
  imports: [ChartModule],
  templateUrl: './ligne-credit-type.component.html',
  styleUrl: './ligne-credit-type.component.scss'
})
export class LigneCreditTypeComponent {
  chartData: any;


  
  chartOptions: any;
  dataParFamille : {[famille : string]:{ [nature: string]: LigneCredit[] }}={};
  subscription!: Subscription;
  groupedLignesByNature: { [nature: string]: LigneCredit[]; }={};

  constructor(public layoutService: LayoutService,
    private ligneCreditService: LigneCreditService,
  ) {
    this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => {
      this.initChart();
    });
  }
  private getData(){
    this.ligneCreditService.getGroupedByNature('crédits au particuliérs').subscribe(grouped => {
      this.dataParFamille["crédits au particuliérs"] = grouped;
    });
    this.ligneCreditService.getGroupedByNature('crédits de gestion').subscribe(grouped => {
      this.dataParFamille["crédits de gestion"] = grouped;
    });
    this.ligneCreditService.getGroupedByNature("crédits d'investissement").subscribe(grouped => {
      this.dataParFamille["crédits d'investissement"] = grouped;
    });
    this.ligneCreditService.getGroupedByNature('crédits de consolidation').subscribe(grouped => {
      this.dataParFamille["crédits de consolidation"] = grouped;
    });
  }

  ngOnInit() {
    this.getData();
    setTimeout(()=>{
      this.initChart();
      
    },500)
    this.ligneCreditService.getGroupedByNature('famille1').subscribe(grouped => {
      this.groupedLignesByNature = grouped;
    });
      
  }

  initChart() {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const borderColor = documentStyle.getPropertyValue('--surface-border');
  const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

  const familles = [
    "crédits au particuliérs",
    "crédits de gestion",
    "crédits d'investissement",
    "crédits de consolidation"
  ];

  const natures = [
    "Autorisation sur compte",
    "crédit immobilié",
    "crédit à la consommation"
  ];

  const natureColors: { [nature: string]: string } = {
  "Autorisation sur compte": documentStyle.getPropertyValue('--p-primary-400'),
  "crédit immobilié": documentStyle.getPropertyValue('--p-primary-300'),
  "crédit à la consommation": documentStyle.getPropertyValue('--p-primary-200')
};


  const datasets = natures.map((nature, i) => ({
    type: 'bar',
    label: nature,
    backgroundColor: natureColors[nature],
    data: familles.map(famille => this.dataParFamille[famille]?.[nature]?.length || 0),
    barThickness: 32,
    ...(nature === "crédit à la consommation"
      ? {
          borderRadius: { topLeft: 8, topRight: 8, bottomLeft: 0, bottomRight: 0 },
          borderSkipped: false
        }
      : {})
  }));

  this.chartData = {
    labels: familles.map(f => f.replace("crédits ", "")), // shorten labels
    datasets: datasets
  };

  this.chartOptions = {
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
        stacked: true,
        ticks: {
          color: textMutedColor
        },
        grid: {
          color: 'transparent',
          borderColor: 'transparent'
        }
      },
      y: {
        stacked: true,
        ticks: {
          color: textMutedColor
        },
        grid: {
          color: borderColor,
          borderColor: 'transparent',
          drawTicks: false
        }
      }
    }
  };
}


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
