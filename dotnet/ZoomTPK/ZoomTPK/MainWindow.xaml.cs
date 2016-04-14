using Esri.ArcGISRuntime.Controls;
using Esri.ArcGISRuntime.Layers;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Windows;

namespace ZoomTPK
{
    public partial class MainWindow : Window
    {

        ArcGISLocalTiledLayer tiledLyr;
        String appPath, tpkFilePath, tpkFullPath;


        public MainWindow()
        {
            InitializeComponent();

            //Get the path to the .tpk in the Resources folder
            appPath = Path.GetDirectoryName(Process.GetCurrentProcess().MainModule.FileName);
            tpkFilePath = Path.Combine(appPath, "Resources");
            tpkFullPath = Path.Combine(tpkFilePath, "CharlotteMap.tpk");


            tiledLyr = new ArcGISLocalTiledLayer(tpkFullPath);

            MyMapView.Map.Layers.Add(tiledLyr);
        }

        private void MyMapView_LayerLoaded(object sender, LayerLoadedEventArgs e)
        {
            if (e.LoadError == null)
                return;

            Debug.WriteLine(string.Format("Error while loading layer : {0} - {1}", e.Layer.ID, e.LoadError.Message));
        }

        private async void zoomInButton_Click(object sender, RoutedEventArgs e)
        {
            await MyMapView.ZoomAsync(1.5);
        }

        private async void zoomOutButton_Click(object sender, RoutedEventArgs e)
        {
            await MyMapView.ZoomAsync(.5);
        }
    }
}
