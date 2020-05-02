import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

const DOWNLOAD_TIMEOUT = 1000;

export default class ProjectsFreshdeskWelkinVertikalsaController extends Controller {
  @tracked showDonatePopup = false;
  @tracked isDownloading = false;

  @action
  toggleDonatePopup() {
    this.showDonatePopup = !this.showDonatePopup;
    this.isDownloading = false;
  }

  @action
  downloadTheme() {
    this.isDownloading = true;
    
    setTimeout(() => {
      this.downloadFile();
    }, DOWNLOAD_TIMEOUT);
    
  }

  downloadFile() {
    let element = document.createElement('a'); 
    element.setAttribute('href', '/files/freshdesk-welkin-vertikalsa/export.zip'); 
    element.setAttribute('download', 'freshdesk-welkin-vertikalsa'); 

    document.body.appendChild(element); 
    element.click(); 
    document.body.removeChild(element); 
  }
}
