<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TrialSiteLocationResource extends JsonResource
{
    /**
     * @var null
     */
    protected $message = null;

    /**
     * @param $message
     * @return $this
     */
    public function setMessage($message)
    {
        $this->message = $message;
        return $this;
    }

    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        return parent::toArray($request);
        /*return [
            'id' => $this->id,
 			'trial_id' => $this->trial_id,
 			'code' => $this->code,
 			'title' => $this->title,
 			'address' => $this->address,
 			'country_city' => $this->country_city,
 			'country_timezone' => $this->country_timezone,
 			'email_address' => $this->email_address,
 			'consent_type' => $this->consent_type,
 			'manual_enrollment' => $this->manual_enrollment,
 			'phone_number' => $this->phone_number,
 			'created_at' => $this->created_at,
 			'updated_at' => $this->updated_at,
 			'deleted_at' => $this->deleted_at,

        ];*/
    }

    /**
     * Get additional data that should be returned with the resource array.
     *
     * @param Request $request
     * @return array
     */
    public function with($request)
    {
        return [
            'success' => true,
            'message' => $this->message,
            'meta' => null,
            'errors' => null
        ];
    }
}
