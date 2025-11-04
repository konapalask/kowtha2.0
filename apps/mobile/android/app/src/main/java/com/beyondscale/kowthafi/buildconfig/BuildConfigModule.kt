package com.beyondscale.kowthafi.buildconfig

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.beyondscale.kowthafi.BuildConfig

class BuildConfigModule(reactContext: ReactApplicationContext)
    : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "BuildConfigModule"

    @ReactMethod
    fun isInternal(promise: Promise) {
        promise.resolve(BuildConfig.IS_INTERNAL)
    }
}
