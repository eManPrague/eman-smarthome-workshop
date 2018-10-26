package cz.eman.devfestws

import android.bluetooth.*
import android.bluetooth.le.AdvertiseCallback
import android.bluetooth.le.AdvertiseData
import android.bluetooth.le.AdvertiseSettings
import android.bluetooth.le.BluetoothLeAdvertiser
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.ParcelUuid
import timber.log.Timber
import java.nio.ByteBuffer
import java.util.*

interface GattServerManagerDelegate {
    fun gattManagerDidReceiveLightEnabled(manager: GattServerManager, value: Boolean)
    fun gattManagerDidReceiveLightIntensity(manager: GattServerManager, value: Int) // value from 0 – 100
    fun gattManagerAskingForLightEnabled(manager: GattServerManager): Boolean
    fun gattManagerAskingForLightIntensity(manager: GattServerManager): Int // value from 0 – 100
    fun gattManagerAskingForTemperature(manager: GattServerManager): Float?
    fun gattManagerAskingForPressure(manager: GattServerManager): Float?
}

class GattServerManager(val context: Context, val name: String, val delegate: GattServerManagerDelegate)  {

    private val serviceUUID =       UUID.fromString("1de17164-d638-11e8-9f8b-f2801f1b9fd1")

    private val charLight =         UUID.fromString("1de173f8-d638-11e8-9f8b-f2801f1b9fd1")
    private val charLightIntensity= UUID.fromString("1de17556-d638-11e8-9f8b-f2801f1b9fd1")
    private val charTemperature =   UUID.fromString("1de17696-d638-11e8-9f8b-f2801f1b9fd1")
    private val charPressure =      UUID.fromString("1de17ad8-d638-11e8-9f8b-f2801f1b9fd1")

    private lateinit var btManager: BluetoothManager
    private lateinit var adapter: BluetoothAdapter

    val isOn: Boolean
        get() = adapter.state == BluetoothAdapter.STATE_ON

    private fun enableBLE() {
        adapter.enable()
    }

    private var bluetoothGattServer: BluetoothGattServer? = null


    /**
     * Start the manager, enable BLE if necessary, start advertising and server.
     */
    fun start() {
        btManager = context.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
        adapter = btManager.adapter

        context.registerReceiver(onStateChange, IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED))

        gattServerCallback.parent = this

        if (!isOn) {
            enableBLE()
        } else {
            startAdvertising()
            startServer()
        }
    }

    /**
     * Initialize the GATT server instance with the services/characteristics
     * from the Time Profile.
     */
    private fun startServer() {
        bluetoothGattServer = btManager.openGattServer(context, gattServerCallback)

        val service = BluetoothGattService(serviceUUID, BluetoothGattService.SERVICE_TYPE_PRIMARY)

        addReadWriteNoResponseChar(service, charLight)
        addReadWriteNoResponseChar(service, charLightIntensity)
        addReadChar(service, charTemperature)
        addReadChar(service, charPressure)

        bluetoothGattServer?.addService(service)
    }

    private fun addReadChar(service: BluetoothGattService, charUUID: UUID) {
        val char = BluetoothGattCharacteristic(charUUID, BluetoothGattCharacteristic.PROPERTY_READ, BluetoothGattCharacteristic.PERMISSION_READ)
        service.addCharacteristic(char)
    }

    private fun addReadWriteNoResponseChar(service: BluetoothGattService, charUUID: UUID) {
        val char = BluetoothGattCharacteristic(charUUID, (BluetoothGattCharacteristic.PROPERTY_READ or BluetoothGattCharacteristic.PROPERTY_WRITE_NO_RESPONSE), (BluetoothGattCharacteristic.PERMISSION_WRITE or BluetoothGattCharacteristic.PERMISSION_READ))
        service.addCharacteristic(char)
    }

    /**
     * Shut down the GATT server.
     */
    private fun stopServer() {
        bluetoothGattServer?.close()
    }

    /**
     * Listens for Bluetooth adapter events to enable/disable
     * advertising and server functionality.
     */
    private val onStateChange = object: BroadcastReceiver() {
        override fun onReceive(p0: Context?, p1: Intent?) {
            when (adapter.state) {
                BluetoothAdapter.STATE_ON -> {
                    Timber.i("BLE ENABLED")
                    start()
                }
                BluetoothAdapter.STATE_OFF -> {
                    Timber.i("BLE OFF")
                }
            }
        }
    }

    /**
     * Begin advertising over Bluetooth.
     */
    private fun startAdvertising() {
        val bluetoothLeAdvertiser: BluetoothLeAdvertiser? = adapter.bluetoothLeAdvertiser

        val maxNameLength = 6

        if (name.length < maxNameLength) {
            adapter.name = name
        } else {
            adapter.name = name.substring(0.until(maxNameLength))
        }

        bluetoothLeAdvertiser?.let {
            val settings = AdvertiseSettings.Builder()
                    .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY)
                    .setConnectable(true)
                    .setTimeout(0)
                    .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_MEDIUM)
                    .build()

            val data = AdvertiseData.Builder()
                    .setIncludeDeviceName(true)
                    .setIncludeTxPowerLevel(false)
                    .addServiceUuid(ParcelUuid(serviceUUID))
                    .build()

            it.startAdvertising(settings, data, advertiseCallback)
        } ?: Timber.w("Failed to create BLE advertiser")
    }

    /**
     * Stop Bluetooth advertisements.
     */
    private fun stopAdvertising() {
        val bluetoothLeAdvertiser: BluetoothLeAdvertiser? = adapter.bluetoothLeAdvertiser
        bluetoothLeAdvertiser?.let {
            it.stopAdvertising(advertiseCallback)
        } ?: Timber.w("Failed to create advertiser")
    }

    /**
     * Callback to receive information about the advertisement process.
     */
    private val advertiseCallback = object : AdvertiseCallback() {
        override fun onStartSuccess(settingsInEffect: AdvertiseSettings) {
            Timber.i("BLE Advertise Started")
        }

        override fun onStartFailure(errorCode: Int) {
            Timber.w("BLE Advertise Failed: $errorCode")
        }
    }

    /**
     * Callback to handle incoming requests to the GATT server.
     * All read/write requests for characteristics are handled here.
     */
    private val gattServerCallback = object : BluetoothGattServerCallback() {
        lateinit var parent: GattServerManager

        override fun onConnectionStateChange(device: BluetoothDevice?, status: Int, newState: Int) {
            when (newState) {
                BluetoothProfile.STATE_CONNECTED -> Unit
                BluetoothProfile.STATE_DISCONNECTED -> Unit
            }
        }

        override fun onCharacteristicReadRequest(device: BluetoothDevice?, requestId: Int, offset: Int, characteristic: BluetoothGattCharacteristic?) {
            if (characteristic == null) return

            when (characteristic.uuid) {
                charLight -> {
                    val value = if (delegate.gattManagerAskingForLightEnabled(this@GattServerManager)) 0x01.toByte() else 0x00.toByte()

                    val buffer = ByteBuffer.allocate(1).put(value).array()
                    bluetoothGattServer?.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, 0, buffer)
                }
                charLightIntensity -> {
                    val value = delegate.gattManagerAskingForLightIntensity(this@GattServerManager)

                    val buffer = ByteBuffer.allocate(1).put(value.toByte()).array()
                    bluetoothGattServer?.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, 0, buffer)
                }
                charTemperature -> {
                    val value = delegate.gattManagerAskingForTemperature(this@GattServerManager)

                    if (value != null) {
                        val intValue = (value * 100).toInt()

                        val buffer = ByteBuffer.allocate(4).putInt(intValue).array()

                        bluetoothGattServer?.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, 0, buffer)
                    } else {
                        bluetoothGattServer?.sendResponse(device, requestId, BluetoothGatt.GATT_FAILURE, 0, ByteArray(0))
                    }
                }
                charPressure -> {
                    val value = delegate.gattManagerAskingForPressure(this@GattServerManager)

                    if (value != null) {
                        val intValue = (value * 100).toInt()

                        val buffer = ByteBuffer.allocate(4).putInt(intValue).array()

                        bluetoothGattServer?.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, 0, buffer)
                    } else {
                        bluetoothGattServer?.sendResponse(device, requestId, BluetoothGatt.GATT_FAILURE, 0, ByteArray(0))
                    }
                }
            }
        }

        override fun onCharacteristicWriteRequest(device: BluetoothDevice?, requestId: Int, characteristic: BluetoothGattCharacteristic?, preparedWrite: Boolean, responseNeeded: Boolean, offset: Int, value: ByteArray?) {
            if (value == null || value.isEmpty()) return
            if (characteristic == null) return

            when (characteristic.uuid) {
                charLight -> {
                    val enabled = value[0] != 0x00.toByte()
                    delegate.gattManagerDidReceiveLightEnabled(this@GattServerManager, enabled)
                }
                charLightIntensity -> {
                    val intensity = ByteBuffer.wrap(value).get()
                    delegate.gattManagerDidReceiveLightIntensity(this@GattServerManager, intensity.toInt())
                }
            }
        }
    }
}