<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TrialEditResource extends JsonResource
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
        //return parent::toArray($request);
        return [
            'id' => $this->id,
            "name" => $this->name,
            "sponsor_id" => $this->sponsor_id,
            "recruitment_url" => $this->recruitment_url,
            "study_number" => $this->study_number,
            "email" => $this->email,
            "countries" => $this->countries,
            "contact_number" => $this->contact_number,
            "languages" => $this->languages,
            "short_code" => $this->short_code,
            "app_name" => $this->app_name,
            "app_store_url" => $this->app_store_url,
            "play_store_url" => $this->play_store_url,
            "description" => $this->description,
            "services" => $this->services,
            "has_appointment_locations" => $this->has_appointment_locations,

        ];
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
