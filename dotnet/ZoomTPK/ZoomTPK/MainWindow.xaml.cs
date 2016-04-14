using Esri.ArcGISRuntime.Controls;
using System;
using System.Diagnostics;
using System.Linq;
using System.Windows;

namespace ZoomTPK
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
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
