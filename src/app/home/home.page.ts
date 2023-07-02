import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PhotoService } from '../services/photo.service';
import { Plugins } from '@capacitor/core';
import axios from 'axios';

const { Filesystem } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  picture?:string;

  constructor(private photoService:PhotoService) {
    this.statusFiles = [];
  }

  statusFiles: string[];

  

  async ionViewDidEnter() {
    this.statusFiles = await this.getWhatsAppStatusDirectory();
  }
  // addPhotoToGallery() {
  //   this.photoService.addNewToGallery();
  // }

  public async addNewToGallery() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      saveToGallery:true,
      source:CameraSource.Prompt,
      resultType: CameraResultType.Uri
    });

    this.picture = image.webPath;
  }

  async getWhatsAppStatusDirectory() {
    try {
      const result = await Filesystem['readdir']({
        path: 'WhatsApp/Media/.Statuses',
        directory: 'EXTERNAL',
      });
      console.log('WhatsApp status files:', result.files);
      return result.files; // Return the list of status files
    } catch (error) {
      console.error('Error reading WhatsApp status directory:', error);
      return []; // Return an empty array or handle the error accordingly
    }
  }
  async downloadStatusFile(fileUrl: string, savePath: string) {
    try {
      const response = await axios.get(fileUrl, { responseType: 'blob' });
      const blob = new Blob([response.data]);

      // Save the status file using the Capacitor Filesystem plugin
      await Filesystem['writeFile']({
        path: savePath,
        data: blob,
        directory: 'DATA',
      });

      console.log('Status file downloaded and saved:', savePath);
    } catch (error) {
      console.error('Error downloading status file:', error);
    }
  }
}