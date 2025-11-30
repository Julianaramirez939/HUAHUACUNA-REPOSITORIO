import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoticiasNinosService } from '../../services/noticias-ninos.service';
import { NinosService } from '../../services/ninos.service';
import { NoticiaProgreso } from '../../interfaces/noticia-progreso';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-progreso-ninos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './progreso-ninos.component.html',
  styleUrls: ['./progreso-ninos.component.css'],
})
//Componente para ver el progreso de los niños apadrinados desde el panel del padrino
export class ProgresoNinosComponent implements OnInit {
  ninos: any[] = [];
  noticias: NoticiaProgreso[] = [];
  selectedChildId: number | null = null;
  cargando = false;

  constructor(
    private noticiasService: NoticiasNinosService,
    private ninosService: NinosService
  ) {}

  ngOnInit(): void {
    this.cargarNinosApadrinados();
  }
  //Metodo para cargar los niños apadrinados de ese padrino especifico
  cargarNinosApadrinados(): void {
    const padrinoIdStr = sessionStorage.getItem('padrino');
    if (!padrinoIdStr) return;

    const padrinoId = Number(padrinoIdStr);
    if (isNaN(padrinoId)) return;

    this.cargando = true;

    this.ninosService.traerNinosApadrinados(padrinoId).subscribe({
      next: (data) => {
        const todosLosNinos = data.flat();

        this.ninos = todosLosNinos.filter((n) =>
          (Array.isArray(n.state) ? n.state : [n.state]).some(
            (s) => s?.name?.toLowerCase() === 'activo'
          )
        );

        this.cargarNoticias();
        this.cargando = false;
      },
      error: () => (this.cargando = false),
    });
  }
  //Metodo para cargar las noticias
  cargarNoticias(): void {
    const godparentId = Number(sessionStorage.getItem('padrino'));
    if (!godparentId) return;

    this.cargando = true;

    if (!this.selectedChildId) {
      this.noticiasService
        .traerNoticiasNinosApadrinados(godparentId)
        .subscribe({
          next: (res) => {
            this.noticias = res.map((noticia) => this.mapearNoticia(noticia));
            this.cargando = false;
          },
          error: () => (this.cargando = false),
        });
      return;
    }

    // Si se selecciona UN niño
    this.noticiasService
      .traerNoticiaNino(this.selectedChildId, godparentId)
      .subscribe({
        next: (res) => {
          this.noticias = res.map((noticia) => this.mapearNoticia(noticia));
          this.cargando = false;
        },
        error: () => (this.cargando = false),
      });
  }
  //Metodo para mapear la noticia en la card
  mapearNoticia(noticia: any): NoticiaProgreso {
    return {
      id: noticia.id,
      titulo: noticia.title,
      descripcion: noticia.description,
      imagen: noticia.media_file_url,
      fecha: this.convertirFecha12H(noticia.created_at),
      nombresNinos: noticia.children.map((c: any) => c.full_name).join(' - '),
    };
  }
  //Metodo para convertir la fecha en 12h
  private convertirFecha12H(fecha: string): string {
    const partes = fecha.split(' ');
    const fechaPart = partes[0];
    let horaPart = partes[1];

    let [h, m] = horaPart.split(':').map(Number);
    const sufijo = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;

    return `${fechaPart} ${h}:${m.toString().padStart(2, '0')} ${sufijo}`;
  }
  // Método para generar y abrir el PDF en otra pestaña

  generarPdf(): void {
    const padrinoIdStr = sessionStorage.getItem('padrino');
    if (!padrinoIdStr) return;

    const padrinoId = Number(padrinoIdStr);
    if (isNaN(padrinoId)) return;

    Swal.fire({
      title: '¿Generar PDF?',
      text: 'Se abrirá el PDF del progreso en una nueva pestaña.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, generar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0D47A1', 
      cancelButtonColor: '#db1515ff',
    }).then((result) => {
      if (result.isConfirmed) {
        this.noticiasService.generarPdf(padrinoId).subscribe({
          next: (pdfBlob: Blob) => {
            const url = URL.createObjectURL(pdfBlob);
            window.open(url, '_blank');
          },
          error: (err) => {
            console.error('Error al generar el PDF:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo generar el PDF',
            });
          },
        });
      }
    });
  }
}
