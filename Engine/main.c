#include <gtk/gtk.h>
#include <webkit2/webkit2.h>

static void destroyWindow(GtkWidget *widget, gpointer data)
{
    gtk_main_quit();
}

int main(int argc, char **argv)
{
    gtk_init(NULL, NULL);

    GtkWidget *window_widget = gtk_window_new(GTK_WINDOW_TOPLEVEL);
    GtkWindow *window = GTK_WINDOW(window_widget);

    gtk_window_set_title(window, "iLGE Engine");
    gtk_window_set_default_size(window, 640, 480);

    g_signal_connect(window_widget, "destroy", G_CALLBACK(destroyWindow), NULL);

    WebKitWebView *webView = WEBKIT_WEB_VIEW(webkit_web_view_new());
    gtk_container_add(GTK_CONTAINER(window_widget), GTK_WIDGET(webView));
    
    if (argc > 1)
        webkit_web_view_load_uri(webView, argv[1]);

    gtk_widget_show_all(window_widget);
    gtk_main();

    return 0;
}