package cz.eman.devfestws

import android.app.Activity
import android.os.Bundle
import timber.log.Timber


class MainActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        Timber.plant(Timber.DebugTree())

        // TODO: Start writing code here...
    }

}
